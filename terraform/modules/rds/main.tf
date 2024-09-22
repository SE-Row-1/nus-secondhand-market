resource "aws_db_instance" "default" {
  allocated_storage    = 20
  engine              = "postgres"
  instance_class      = var.db_instance_class
  db_name                = var.db_name
  username            = var.db_username
  password            = var.db_password
  parameter_group_name = "default.postgres12"
  skip_final_snapshot  = true
  vpc_security_group_ids = [var.vpc_security_group_id]
  db_subnet_group_name = "default"
}
