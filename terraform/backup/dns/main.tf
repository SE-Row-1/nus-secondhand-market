terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4"
    }
  }
}

resource "cloudflare_record" "argocd_dns_record" {
  zone_id = var.cloudflare_zone_id
  name    = "argocd.nshm.store"
  value   = var.argocd_ingress_dns
  type    = "CNAME"
  ttl     = 1
  proxied = true
}
