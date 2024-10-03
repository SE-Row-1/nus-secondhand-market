variable "public_subnet_ids" {
  description = "The public subnet IDs for the EKS cluster"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "The private subnet IDs for the EKS cluster"
  type        = list(string)
}

variable "security_group_id" {
  description = "The security group ID for the EKS cluster"
  type        = string
}
