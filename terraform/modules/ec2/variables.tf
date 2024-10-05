variable "vpc_id" {
  type        = string
}

variable "security_group_id" {
  type        = string
}

variable "public_subnet_ids" {
  type        = list(string)
}

variable "cluster_name" {
  type        = string
}
