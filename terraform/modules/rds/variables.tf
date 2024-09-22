variable "db_name" {
  description = "RDS database name"
  type        = string
  default     = "nus-secondhand-market"
}

variable "db_password" {
  description = "RDS database password"
  type        = string
  default     = "password"
  sensitive   = "true"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_username" {
  description = "RDS database username"
  type        = string
  default     = "admin"
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

