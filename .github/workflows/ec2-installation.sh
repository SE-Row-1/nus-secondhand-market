#!/bin/bash
aws s3 cp s3://nus-backend-terraform/setup/argo-values.yaml .
aws s3 cp s3://nus-backend-terraform/setup/argocd-project.yaml .
aws s3 cp s3://nus-backend-terraform/setup/argocd-app.yaml .
aws s3 cp s3://nus-backend-terraform/setup/ec2.gpg .
aws s3 cp s3://nus-backend-terraform/setup/nshm.passphrase .
gpg --batch --yes --decrypt --passphrase-file=nshm.passphrase --output ec2 ec2.gpg
source ec2
alias k='kubectl'

# Install eksctl
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH
curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"
tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz
sudo mv /tmp/eksctl /usr/local/bin

# Install kubectl
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin

# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Update kubeconfig for EKS
aws eks --region ap-southeast-1 update-kubeconfig --name nshm-eks

# Deploy autoscaler
if [[ ! -e ~/.aws/credentials ]]; then
  echo "There is no credentials file.. Please check !!!!"
else
  echo "Exporting credentials for cluster autoscaler....."
  export AWS_ACCESS_KEY_ID=$(awk -F ' = ' '/aws_access_key_id/ {print $2}' ~/.aws/credentials)
  export AWS_SECRET_ACCESS_KEY=$(awk -F ' = ' '/aws_secret_access_key/ {print $2}' ~/.aws/credentials)
fi

helm repo add autoscaler https://kubernetes.github.io/autoscaler
helm install -n kube-system cluster-autoscaler autoscaler/cluster-autoscaler \
--set autoDiscovery.clusterName=nshm-eks \
--set awsRegion=ap-southeast-1 \
--set awsAccessKeyID=${AWS_ACCESS_KEY_ID} \
--set awsSecretAccessKey=${AWS_SECRET_ACCESS_KEY}

# Deploy ALB Ingress Controller
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.7.2/docs/install/iam_policy.json
aws iam create-policy \
--policy-name AWSLoadBalancerControllerIAMPolicy \
--policy-document file://iam_policy.json
eksctl utils associate-iam-oidc-provider --region=ap-southeast-1 --cluster=nshm-eks --approve
eksctl create iamserviceaccount \
--cluster=nshm-eks \
--namespace=kube-system \
--name=aws-load-balancer-controller \
--role-name AmazonEKSLoadBalancerControllerRole \
--attach-policy-arn=arn:aws:iam::985539788320:policy/AWSLoadBalancerControllerIAMPolicy \
--approve

helm repo add eks https://aws.github.io/eks-charts
helm repo update eks
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
-n kube-system \
--set clusterName=nshm-eks \
--set serviceAccount.create=false \
--set serviceAccount.name=aws-load-balancer-controller \
--set vpcId=$(aws ec2 describe-instances  --filters "Name=tag:Name,Values=nshm-bastion" --query "Reservations[*].Instances[*].VpcId" --output text)
kubectl get deployment -n kube-system aws-load-balancer-controller


# Deploy ArgoCD with ALB Ingress
kubectl create namespace argocd
helm repo add argo https://argoproj.github.io/argo-helm
helm install argocd argo/argo-cd -n argocd --create-namespace -f argo-values.yaml
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Deploy ArgoCD Applicaiton
ARGOCD_VERSION=$(curl --silent "https://api.github.com/repos/argoproj/argo-cd/releases/latest" | grep '"tag_name"' | sed -E 's/.*"([^"]+)".*/\1/')
curl -sSL -o /tmp/argocd-${ARGOCD_VERSION} https://github.com/argoproj/argo-cd/releases/download/${ARGOCD_VERSION}/argocd-linux-amd64
chmod +x /tmp/argocd-${ARGOCD_VERSION}
sudo mv /tmp/argocd-${ARGOCD_VERSION} /usr/local/bin/argocd
kubectl create ns nshm
kubectl apply -f argocd-project.yaml -n argocd
kubectl apply -f argocd-app.yaml -n argocd
