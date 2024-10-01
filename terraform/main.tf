provider "aws" {
  region = "ap-southeast-1"
}

module "vpc" {
  source = "./modules/vpc"
}

module "ec2" {
  source = "./modules/ec2"
  subnet_id = module.vpc.subnet_ids[0]
  vpc_security_group_id = module.vpc.security_group_id
}

module "s3" {
  source = "./modules/s3"
}

output "public_ip" {
  value = module.ec2.public_ip
}
