provider "aws" {
    region = "ap-south-2"
}

resource "aws_instance" "cicd_ec2" {
    ami = "ami-070e5bd3ff10324f8"
    instance_type = "t3.small"
    key_name = "devopskey"
    associate_public_ip_address = true
    vpc_security_group_ids = ["aws_security_group.cicd_sg.id"]

    user_data = <<-EOF
                apt update
                apt install -y nginx
                systemctl start nginx
                systemctl enable nginx
                EOF
    
    tags = {
        Name = "cicd-ec2"
    }
}

resource "aws_security_group" "cicd_sg" {
    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "cicd-sg"
    }
}

output "public_ip" {
    value = aws_instance.cicd_ec2.public_ip
}