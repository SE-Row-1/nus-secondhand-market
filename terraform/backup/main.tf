provider "aws" {
  region = "ap-southeast-1"
}

terraform {
  required_providers {
   #cloudflare = {
   #  source  = "cloudflare/cloudflare"
   #  version = "~> 4"
   #}
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
}

# module "dns" {
#   source = "./modules/dns"
#   argocd_ingress_dns  = module.argocd.argocd_ingress_dns
# }

module "vpc" {
  source = "./modules/vpc"
}

module "ec2" {
  source = "./modules/ec2"
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  cluster_name = module.eks.cluster_name
}

module "s3" {
  source = "./modules/s3"
}

module "rds" {
  source = "./modules/rds"
  vpc_id            = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
}

module "eks" {
  source                = "./modules/eks"
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  public_subnet_ids     = module.vpc.public_subnet_ids
}

# module "alb" {
#   source = "./modules/alb"
#   eks_cluster_name = module.eks.cluster_name
# }

# module "argocd" {
#   source = "./modules/argocd"
#   alb_controller_name = module.alb.alb_controller_name
# }

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "db_instance_endpoint" {
  value = module.rds.db_instance_endpoint
}

output "db_instance_password" {
  value     = module.rds.db_instance_password
  sensitive = true
}
