resource "aws_vpc" "nus-secondhand-market" {
  cidr_block           = var.vpc_cidr
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
    "kubernetes.io/role/elb"         = "1"
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
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.nus-secondhand-market.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nus_secondhand_market.id
  }

  tags = {
    Name = "nus-secondhand-market-private-route-table"
  }
}

resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

resource "aws_nat_gateway" "nus_secondhand_market" {
  allocation_id = aws_eip.nus_secondhand_market.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "nus-secondhand-market-nat-gateway"
  }
}

resource "aws_eip" "nus_secondhand_market" {
  vpc = true

  tags = {
    Name = "nus-secondhand-market-eip"
  }
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

output "nat_gateway_id" {
  value = aws_nat_gateway.nus_secondhand_market.id
}

output "nat_gateway_eip" {
  value = aws_eip.nus_secondhand_market.id
}

