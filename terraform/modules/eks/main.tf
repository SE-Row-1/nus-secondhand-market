resource "aws_security_group" "nshm-eks-sg" {
  vpc_id = var.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
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
    Name = "nshm-eks-sg"
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
    security_group_ids      = [aws_security_group.nshm-eks-sg.id]
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

# Managed Node Group
  resource "aws_eks_node_group" "nshm_node_group" {
  cluster_name    = aws_eks_cluster.nshm_cluster.name
  node_group_name = "nshm-eks-workers-30"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = var.public_subnet_ids
  instance_types  = ["t2.micro", "t3.micro"]
  capacity_type   = "SPOT"

  scaling_config {
    desired_size = 5
    max_size     = 30
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

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy_attachment
  ]
}

# IAM Policy for EKS Cluster Role
data "aws_iam_policy_document" "eks_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }
  }
}

# IAM Policy for Node Group Role
data "aws_iam_policy_document" "eks_node_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

# IAM Role for EKS Cluster
resource "aws_iam_role" "eks_cluster_role" {
  name               = "eks-cluster-role"
  assume_role_policy = data.aws_iam_policy_document.eks_assume_role_policy.json
}

# IAM Role for EKS Node Group
resource "aws_iam_role" "eks_node_role" {
  name               = "eks-node-role"
  assume_role_policy = data.aws_iam_policy_document.eks_node_assume_role_policy.json
}

# Attach Policies to EKS Cluster Role
resource "aws_iam_role_policy_attachment" "eks_cluster_policy_attachment" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_iam_role_policy_attachment" "eks_vpc_resource_controller_policy_attachment" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
}

# Attach Policies to Node Group Role
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

# Addons for EKS
resource "aws_eks_addon" "coredns" {
  cluster_name      = aws_eks_cluster.nshm_cluster.name
  addon_name        = "coredns"
  resolve_conflicts = "OVERWRITE"

  tags = {
    Environment = "production"
    Created     = "EKS"
  }
}

resource "aws_eks_addon" "vpc_cni" {
  cluster_name      = aws_eks_cluster.nshm_cluster.name
  addon_name        = "vpc-cni"
  resolve_conflicts = "OVERWRITE"

  tags = {
    Environment = "production"
    Created     = "EKS"
  }
}

resource "aws_eks_addon" "kube_proxy" {
  cluster_name      = aws_eks_cluster.nshm_cluster.name
  addon_name        = "kube-proxy"
  resolve_conflicts = "OVERWRITE"

  tags = {
    Environment = "production"
    Created     = "EKS"
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "eks_log_group" {
  name              = "/aws/eks/nus-secondhand-market-eks"
  retention_in_days = 30

  tags = {
    Environment = "production"
    Created     = "EKS"
  }
}


# Output Variables
output "cluster_endpoint" {
  value = aws_eks_cluster.nshm_cluster.endpoint
}

output "cluster_name" {
  value = aws_eks_cluster.nshm_cluster.name
}

