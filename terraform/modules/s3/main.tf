resource "aws_s3_bucket" "bucket" {
  bucket = "nus-secondhand-market"
  acl    = "private"
}

# output "s3_bucket_name" {
#   value = aws_s3_bucket.bucket.bucket
# }
