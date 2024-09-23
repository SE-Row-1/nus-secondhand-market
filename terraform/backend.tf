terraform {
  backend "s3" {
    bucket         = "nus-secondhand-market"
    key            = "terraform/state"
    region         = "ap-southeast-1"
  }
}
