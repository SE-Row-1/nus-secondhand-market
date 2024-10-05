resource "aws_vpc" "nus-secondhand-market" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "nus-secondhand-market-vpc"
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  cidr_block               = var.public_subnet_cidr_blocks[count.index]
  vpc_id                   = aws_vpc.nus-secondhand-market.id
  availability_zone        = element(var.availability_zones, count.index)
  map_public_ip_on_launch  = true

  tags = {
    Name = "nus-secondhand-market-public-subnet-${count.index + 1}"
  }
}

resource "aws_internet_gateway" "nus-secondhand-market" {
  vpc_id = aws_vpc.nus-secondhand-market.id

  tags = {
    Name = "nus-secondhand-market-igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.nus-secondhand-market.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.nus-secondhand-market.id
  }

  tags = {
    Name = "nus-secondhand-market-public-route-table"
  }
}

resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_subnet" "private" {
  count             = 2
  cidr_block        = var.private_subnet_cidr_blocks[count.index]
  vpc_id            = aws_vpc.nus-secondhand-market.id
  availability_zone = element(var.availability_zones, count.index)

  tags = {
    Name = "nus-secondhand-market-private-subnet-${count.index + 1}"
    "kubernetes.io/role/internal-elb" = 1
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.nus-secondhand-market.id

  tags = {
    Name = "nus-secondhand-market-private-route-table"
  }
}

resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

resource "aws_security_group" "endpoint" {
  name        = "nus-secondhand-market-endpoint-sg"
  description = "Security group for VPC Endpoints"
  vpc_id      = aws_vpc.nus-secondhand-market.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.nus-secondhand-market.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "nus-secondhand-market-endpoint-sg"
  }
}

# S3 Gateway Endpoint
resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.nus-secondhand-market.id
  service_name = "com.amazonaws.ap-southeast-1.s3"
  route_table_ids = [
    aws_route_table.private.id
  ]
}

# ECR API Endpoint
resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id            = aws_vpc.nus-secondhand-market.id
  service_name      = "com.amazonaws.ap-southeast-1.ecr.api"
  vpc_endpoint_type = "Interface"
  security_group_ids = [
    aws_security_group.endpoint.id
  ]
  subnet_ids = [
    aws_subnet.private[0].id,
    aws_subnet.private[1].id
  ]
}

# ECR Docker Endpoint
resource "aws_vpc_endpoint" "ecr_docker" {
  vpc_id            = aws_vpc.nus-secondhand-market.id
  service_name      = "com.amazonaws.ap-southeast-1.ecr.dkr"
  vpc_endpoint_type = "Interface"
  security_group_ids = [
    aws_security_group.endpoint.id
  ]
  subnet_ids = [
    aws_subnet.private[0].id,
    aws_subnet.private[1].id
  ]
}

# EC2 Endpoint
resource "aws_vpc_endpoint" "ec2" {
  vpc_id            = aws_vpc.nus-secondhand-market.id
  service_name      = "com.amazonaws.ap-southeast-1.ec2"
  vpc_endpoint_type = "Interface"
  security_group_ids = [
    aws_security_group.endpoint.id
  ]
  subnet_ids = [
    aws_subnet.private[0].id,
    aws_subnet.private[1].id
  ]
}

# CloudWatch Logs Endpoint
resource "aws_vpc_endpoint" "cw_logs" {
  vpc_id            = aws_vpc.nus-secondhand-market.id
  service_name      = "com.amazonaws.ap-southeast-1.logs"
  vpc_endpoint_type = "Interface"
  security_group_ids = [
    aws_security_group.endpoint.id
  ]
  subnet_ids = [
    aws_subnet.private[0].id,
    aws_subnet.private[1].id
  ]
}

# STS Endpoint
resource "aws_vpc_endpoint" "sts" {
  vpc_id            = aws_vpc.nus-secondhand-market.id
  service_name      = "com.amazonaws.ap-southeast-1.sts"
  vpc_endpoint_type = "Interface"
  security_group_ids = [
    aws_security_group.endpoint.id
  ]
  subnet_ids = [
    aws_subnet.private[0].id,
    aws_subnet.private[1].id
  ]
}

output "vpc_id" {
  value = aws_vpc.nus-secondhand-market.id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "security_group_id" {
  value = aws_security_group.endpoint.id
}

