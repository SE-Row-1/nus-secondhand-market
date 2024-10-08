resource "random_password" "db_password" {
  length  = 16
  special = true
}

resource "aws_db_subnet_group" "default" {
  name       = "nus-secondhand-market-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "nus-secondhand-market db subnet group"
  }
}

resource "aws_security_group" "nshm_rds_sg" {
  name        = "nshm-rds-sg"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "nshm-rds-sg"
  }
}

resource "aws_db_instance" "default" {
  identifier          = "nus-secondhand-market-db"
  allocated_storage   = 20
  engine              = "postgres"
  instance_class      = var.db_instance_class
  db_name             = var.db_name
  username            = var.db_username
  password            = random_password.db_password.result
  skip_final_snapshot = true
  vpc_security_group_ids =  [aws_security_group.nshm_rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.default.name

}

output "db_instance_endpoint" {
  value = aws_db_instance.default.endpoint
}

output "db_instance_password" {
  value     = random_password.db_password.result
  sensitive = true
}
