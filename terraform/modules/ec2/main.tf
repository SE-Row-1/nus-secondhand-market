resource "aws_instance" "nus-secondhand-market" {
  ami           = "ami-01811d4912b4ccb26"
  instance_type = "t2.micro"
  key_name     = "nus-secondhand-market"
  vpc_security_group_ids = [var.vpc_security_group_id]
  subnet_id     = var.subnet_id

 user_data = <<-EOF
              #!/bin/bash
              sudo apt-get install -y docker.io
              sudo systemctl start docker
              sudo systemctl enable docker
              # Install Docker Compose
              sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              sudo chmod +x /usr/local/bin/docker-compose
              EOF

  tags = {
    Name = "nus-secondhand-market-ec2"
  }
}
