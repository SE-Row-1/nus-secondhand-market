resource "aws_vpc_endpoint" "eks" {
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${var.region}.eks"
  vpc_endpoint_type   = "Interface"

  subnet_ids          = var.private_subnet_ids
  security_group_ids  = [aws_security_group.eks_sg.id]

  tags = {
    Name = "eks-endpoint"
  }
}

resource "aws_security_group" "eks_sg" {
  vpc_id = var.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "eks-sg"
  }
}

resource "aws_eks_cluster" "nshm_cluster" {
  name     = "nshm-eks"
  version  = "1.30"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids             = concat(var.public_subnet_ids, var.private_subnet_ids)
    endpoint_private_access = true
    endpoint_public_access  = false
    security_group_ids      = [aws_security_group.eks_sg.id]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  tags = {
    Environment = "production"
    Created     = "EKS"
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy_attachment
  ]
}

resource "aws_eks_node_group" "nshm_node_group" {
  cluster_name    = aws_eks_cluster.nshm_cluster.name
  node_group_name = "nshm-eks-workers-30"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = var.private_subnet_ids
  instance_types  = ["t2.micro", "t3.micro"]
  capacity_type   = "SPOT"

  scaling_config {
    desired_size = 2
    max_size     = 2
    min_size     = 0
  }

  disk_size = 20
  labels = {
    role = "worker"
  }

  tags = {
    Environment = "production"
    Created     = "EKS"
  }
}

data "aws_iam_policy_document" "eks_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "eks_node_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "eks_cluster_role" {
  name               = "eks-cluster-role"
  assume_role_policy = data.aws_iam_policy_document.eks_assume_role_policy.json
}

resource "aws_iam_role" "eks_node_role" {
  name               = "eks-node-role"
  assume_role_policy = data.aws_iam_policy_document.eks_node_assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy_attachment" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy_attachment" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy_attachment" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "eks_ecr_readonly_policy_attachment" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_cloudwatch_log_group" "eks_log_group" {
  name              = "/aws/eks/nus-secondhand-market-eks"
  retention_in_days = 30
}

output "cluster_endpoint" {
  value = aws_eks_cluster.nshm_cluster.endpoint
}

output "cluster_name" {
  value = aws_eks_cluster.nshm_cluster.name
}

output "eks_vpc_endpoint_id" {
  value = aws_vpc_endpoint.eks.id
}

