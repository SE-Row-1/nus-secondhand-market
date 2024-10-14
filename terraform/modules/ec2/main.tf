resource "aws_iam_role" "nshm-bastion-role" {
  name = "nshm-bastion-role"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "nshm-bastion-role_policy" {
  name   = "nshm-bastion-role_policy"
  role   = aws_iam_role.nshm-bastion-role.id

  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:*",
          "eks:*",
          "ec2:*",
          "iam:PassRole"  # Required for the ALB controller
        ],
        "Resource": "*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "ec2-instance-profile"
  role = aws_iam_role.nshm-bastion-role.name
}

resource "aws_security_group" "nshm_bastion_sg" {
  name        = "nshm-bastion-sg"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # For ALB traffic
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "nshm-bastion-sg"
  }
}

resource "aws_instance" "nshm_bastion" {
  ami             = "ami-01811d4912b4ccb26"
  instance_type   = "t3.micro"
  key_name        = "nus-secondhand-market"
  subnet_id       = var.public_subnet_ids[0]

  vpc_security_group_ids = [aws_security_group.nshm_bastion_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_instance_profile.name

  user_data = <<-EOF
    #!/bin/bash
    sudo apt-get update
    sudo apt-get install -y curl unzip gnupg
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install

    aws s3 cp s3://nus-backend-terraform/setup/ec2-installation.sh .
    bash ec2-installation.sh
    EOF

  tags = {
    Name = "nshm-bastion"
  }
}

output "bastion_host_public_ip" {
  value = aws_instance.nshm_bastion.public_ip
}

