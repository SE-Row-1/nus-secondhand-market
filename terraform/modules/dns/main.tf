terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4"
    }
  }
}

resource "cloudflare_record" "alb_dns_record" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  value   = var.nshm_alb_dns
  type    = "CNAME"
  ttl     = 1
  proxied = true
}
