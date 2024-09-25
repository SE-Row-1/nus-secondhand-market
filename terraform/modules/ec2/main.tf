resource "aws_instance" "nus-secondhand-market" {
  ami           = "ami-01811d4912b4ccb26"
  instance_type = "t3.micro"
  key_name     = "nus-secondhand-market"
  vpc_security_group_ids = [var.vpc_security_group_id]
  subnet_id     = var.subnet_id

   user_data = <<-EOF
   #!/bin/bash
   # Install docker
     sudo apt-get update
     sudo apt-get install -y cloud-utils apt-transport-https ca-certificates curl software-properties-common
     sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
     sudo add-apt-repository \
          "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
          $(lsb_release -cs) \
          stable"
     sudo apt-get update
     sudo apt-get install -y docker-ce
     sudo usermod -aG docker ubuntu

    # Install docker-compose
     sudo curl -L https://github.com/docker/compose/releases/download/2.29.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
     sudo chmod +x /usr/local/bin/docker-compose
                  EOF

  tags = {
    Name = "nus-secondhand-market-ec2"
  }
}


output "public_ip" {
  value = aws_instance.nus-secondhand-market.public_ip
}
