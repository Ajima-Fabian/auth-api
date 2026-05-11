resource "aws_instance" "jwt_auth_server" {
  ami           = "ami-0fc5d935ebf8bc3bc"
  instance_type = var.instance_type

  tags = {
    Name = "jwt-auth-api"
  }
}