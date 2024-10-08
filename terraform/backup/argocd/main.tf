provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  version    = "5.0.0"

  set {
    name  = "server.ingress.enabled"
    value = "true"
  }

  set {
    name  = "server.ingress.hosts[0]"
    value = var.argocd_hostname
  }

  set {
    name  = "server.ingress.annotations"
    value = jsonencode({
      "kubernetes.io/ingress.class" = "alb"  # ALB Ingress controller
      "alb.ingress.kubernetes.io/scheme" = "internet-facing"
    })
  }

  depends_on =  [var.alb_controller_name]
}
