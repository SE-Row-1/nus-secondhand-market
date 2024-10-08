provider "kubernetes" {
  config_path = "~/.kube/config"  # Ensure this points to your K8s config
}

resource "kubernetes_namespace" "alb" {
  metadata {
    name = "kube-system"  # Typically, the ALB Ingress Controller runs in the kube-system namespace
  }
}

resource "helm_release" "alb_controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  version    = "1.4.5"  # Use the latest stable version

  set {
    name  = "clusterName"
    value = var.eks_cluster_name  # Pass the EKS cluster name as a variable
  }

  set {
    name  = "serviceAccount.create"
    value = "true"  # Creates the service account needed by the controller
  }

  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"  # Name of the service account
  }

  set {
    name  = "region"
    value = var.region  # Pass the AWS region as a variable
  }
}

output "alb_controller_status" {
  value = helm_release.alb_controller.status
}


output "alb_controller_name" {
  value = helm_release.alb_controller.name  # Or other relevant properties
}
