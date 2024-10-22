#!/bin/bash

aws s3 cp s3://nus-backend-terraform/setup . --recursive
aws s3 cp s3://nus-backend-terraform/envs envs --recursive
#
# Update kubeconfig for EKS
aws eks --region ap-southeast-1 update-kubeconfig --name nshm-eks

# Update envs and create secrets for nshm namespace
bash update-envs.sh
bash create-secrets.sh
source envs/ec2

# Deploy autoscaler
helm repo add autoscaler https://kubernetes.github.io/autoscaler
export AWS_ACCESS_KEY_ID=$(awk -F ' = ' '/aws_access_key_id/ {print $2}' ~/.aws/credentials)
export AWS_SECRET_ACCESS_KEY=$(awk -F ' = ' '/aws_secret_access_key/ {print $2}' ~/.aws/credentials)
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
cd argocd
kubectl create namespace argocd
helm repo add argo https://argoproj.github.io/argo-helm
helm install argocd argo/argo-cd -n argocd --create-namespace -f argo-values.yaml
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Add argocd.nshm.store record in cloudflare
bash cloudflare-adddns.sh

# Deploy ArgoCD Applicaiton
kubectl create ns nshm rabbitmq prometheus locust
kubectl apply -f argo-rabbitmq-app.yaml
kubectl apply -f argo-prometheus-app.yam
kubectl apply -f argo-nshm-app.yaml
kubectl apply -f argo-locust-app.yaml

kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 --decode > argocd-admin-secret.txt
