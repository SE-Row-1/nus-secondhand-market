variable "availability_zones" {
  type    = list(string)
  default = ["ap-southeast-1a", "ap-southeast-1c"]
}

variable "public_subnet_cidr_blocks" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidr_blocks" {
  type    = list(string)
  default = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}
