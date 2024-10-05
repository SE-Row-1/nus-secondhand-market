provider "aws" {
  region = "ap-southeast-1"
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
  security_group_id = module.vpc.security_group_id
  cluster_name = module.eks.cluster_name
}

module "rds" {
  source = "./modules/rds"
  private_subnet_ids = module.vpc.private_subnet_ids
  security_group_id = module.vpc.security_group_id
}

module "eks" {
  source           = "./modules/eks"
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids = module.vpc.public_subnet_ids
  security_group_id = module.vpc.security_group_id
  vpc_id            = module.vpc.vpc_id
}

module "alb" {
  source                = "./modules/alb"
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  security_group_id     = module.vpc.security_group_id
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "alb_dns_name" {
  value = module.alb.alb_dns_name
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
