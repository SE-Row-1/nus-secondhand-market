provider "aws" {
  region = "ap-southeast-1"
}

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4"
    }
  }
}

module "dns" {
  source = "./modules/dns"
  nshm_alb_dns = module.alb.nshm_alb_dns
}

module "vpc" {
  source = "./modules/vpc"
}

module "s3" {
  source = "./modules/s3"
}

module "ec2" {
  source = "./modules/ec2"
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  cluster_name = module.eks.cluster_name
}

module "rds" {
  source = "./modules/rds"
  vpc_id            = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
}

module "eks" {
  source           = "./modules/eks"
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids = module.vpc.public_subnet_ids
  vpc_id            = module.vpc.vpc_id
}

module "alb" {
  source                = "./modules/alb"
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids     = module.vpc.private_subnet_ids
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "alb_dns_name" {
  value = module.alb.nshm_alb_dns
}

output "db_instance_endpoint" {
  value = module.rds.db_instance_endpoint
}

output "db_instance_password" {
  value     = module.rds.db_instance_password
  sensitive = true
}

output "bastion_host_public_ip" {
  value     = module.ec2.bastion_host_public_ip
}
