variable "vpc_id" {
  type        = string
}

variable "db_name" {
  type        = string
  default     = "nshm"
}

variable "db_instance_class" {
  type        = string
  default     = "db.t4g.micro"
}

variable "db_username" {
  type        = string
  default     = "nshmadmin"
}


variable "private_subnet_ids" {
  type        = list(string)
}
