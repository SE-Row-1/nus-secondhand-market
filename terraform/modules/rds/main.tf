resource "random_password" "db_password" {
  length  = 16
  special = true
}

resource "aws_db_subnet_group" "default" {
  name       = "nus-secondhand-market-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "nus-secondhand-market db subnet group"
  }
}

resource "aws_db_instance" "default" {
  identifier          = "nus-secondhand-market-db"
  allocated_storage   = 20
  engine              = "postgres"
  instance_class      = var.db_instance_class
  db_name                = var.db_name
  username            = var.db_username
  password            = random_password.db_password.result
  skip_final_snapshot = true
  vpc_security_group_ids = [var.vpc_security_group_id]
  db_subnet_group_name   = aws_db_subnet_group.default.name

}

output "db_instance_endpoint" {
  value = aws_db_instance.default.endpoint
  description = "The endpoint for the RDS instance"
}

output "db_instance_password" {
  value     = random_password.db_password.result
  sensitive = true
  description = "The generated password for the RDS instance"
}
