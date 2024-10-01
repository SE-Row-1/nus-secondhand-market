variable "db_name" {
  description = "RDS database name"
  type        = string
  default     = "secondhandmarket"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_username" {
  description = "RDS database username"
  type        = string
  default     = "nusadmin"
}

variable "vpc_security_group_name" {
  description = "Name of the VPC security group"
  type        = string
  default     = "nus-secondhand-market-sg"
}

variable "vpc_security_group_id" {
  description = "The VPC Security Group ID"
  type        = string
}

variable "subnet_ids" {
  description = "The subnet ID for the EC2 instance"
  type        = list(string)
}
