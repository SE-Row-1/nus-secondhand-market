resource "aws_vpc" "nus-secondhand-market" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public" {
  cidr_block = "10.0.0.0/24"
  vpc_id     = aws_vpc.nus-secondhand-market.id
  availability_zone = "ap-southeast-1a"
}

resource "aws_subnet" "private" {
  cidr_block = "10.0.1.0/24"
  vpc_id     = aws_vpc.nus-secondhand-market.id
  availability_zone = "ap-southeast-1a"
}

resource "aws_internet_gateway" "nus-secondhand-market" {
  vpc_id = aws_vpc.nus-secondhand-market.id
}

resource "aws_internet_gateway_attachment" "nus-secondhand-market" {
  vpc_id         = aws_vpc.nus-secondhand-market.id
  internet_gateway_id = aws_internet_gateway.nus-secondhand-market.id
}

resource "aws_security_group" "nus-secondhand-market" {
  name = "nus-secondhand-market_sg"
  vpc_id = aws_vpc.nus-secondhand-market.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "vpc_id" {
  value = aws_vpc.nus-secondhand-market.id
}

output "subnet_ids" {
  value = [
    aws_subnet.public.id,
    aws_subnet.private.id,
  ]
}

output "security_group_id" {
  value = aws_security_group.nus-secondhand-market.id
}
