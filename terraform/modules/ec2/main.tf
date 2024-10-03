resource "aws_instance" "nshm-bastion" {
  ami                    = "ami-01811d4912b4ccb26"
  instance_type          = "t3.micro"
  key_name               = "nus-secondhand-market"
  vpc_security_group_ids = [var.security_group_id]
  subnet_id              = var.public_subnet_ids

  user_data = <<-EOF
    #!/bin/bash
    sudo apt-get update
    sudo apt-get install -y curl unzip

    # Install AWS CLI
    curl "https://d1wnz8q8g7m9c5.cloudfront.net/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install

    # Install kubectl
    curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
    chmod +x ./kubectl
    sudo mv ./kubectl /usr/local/bin

    # Update kubeconfig for EKS
    aws eks --region ap-southeast-1 update-kubeconfig --name ${var.cluster_name}

    # Optional: Validate installation
    kubectl get nodes
  EOF

  tags = {
    Name = "nus-secondhand-market-ec2"
  }
}

output "bastion_host_public_ip" {
  value = aws_instance.nshm-bastion.public_ip
}

