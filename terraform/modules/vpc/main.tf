resource "aws_vpc" "nus-secondhand-market" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public" {
  cidr_block = "10.0.0.0/24"
  vpc_id     = aws_vpc.nus-secondhand-market.id
  availability_zone = "ap-southeast-1a"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
  count = 2
  cidr_block = var.private_subnet_cidr_blocks[count.index]
  vpc_id     = aws_vpc.nus-secondhand-market.id
  availability_zone = element(var.availability_zones, count.index)

  tags = {
    Name = "nus-secondhand-market-private-subnet-${count.index + 1}"
  }
}

resource "aws_internet_gateway" "nus-secondhand-market" {
  vpc_id = aws_vpc.nus-secondhand-market.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.nus-secondhand-market.id  # Reference your VPC

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.nus-secondhand-market.id
  }

  tags = {
    Name = "Public Route Table"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "nus-secondhand-market" {
  name = "nus-secondhand-market-sg"
  vpc_id = aws_vpc.nus-secondhand-market.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/24"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "vpc_id" {
  value = aws_vpc.nus-secondhand-market.id
}

output "subnet_ids" {
  value = [
    aws_subnet.public.id,
    aws_subnet.private[*].id,
  ]
}

output "security_group_id" {
  value = aws_security_group.nus-secondhand-market.id
}
