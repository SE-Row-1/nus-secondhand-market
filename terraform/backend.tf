terraform {
  backend "s3" {
    bucket         = "nus-backend-terraform"
    key            = "terraform/state"
    region         = "ap-southeast-1"
  }
}
