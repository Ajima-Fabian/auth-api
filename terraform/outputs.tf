output "instance_ip" {
  value = aws_instance.jwt_auth_server.public_ip
}