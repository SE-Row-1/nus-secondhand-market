variable "public_subnet_ids" {
  type        = list(string)
}

variable "private_subnet_ids" {
  type        = list(string)
}

variable "security_group_id" {
  type        = string
}

variable "vpc_id" {
  type      = string
}

variable "region" {
  type      = string
  default   = "ap-southeast-1"
}
