# Enterprise JWT Authentication API (DevOps + Cloud + Production Ready)

A production-grade authentication and authorization system built with a full **DevOps lifecycle pipeline** including CI/CD, containerization, Kubernetes orchestration, Infrastructure as Code (Terraform + Ansible), monitoring, and AWS deployment readiness.

---

# Architecture Overview

```txt
GitHub Repository
      ↓
GitHub Actions (CI/CD Pipeline)
      ↓
Run Tests (Jest)
      ↓
Docker Image Build
      ↓
Push to Docker Registry (DockerHub / ECR)
      ↓
Terraform → AWS EC2 Provisioning
      ↓
Ansible → Server Configuration (Docker, dependencies)
      ↓
Kubernetes Cluster (K3s / EKS)
      ↓
Nginx Reverse Proxy (Ingress Layer)
      ↓
Node.js Auth API (JWT System)
      ↓
MongoDB Atlas (Database)

Monitoring Layer:
Prometheus → Metrics Collection (/metrics endpoint)
```

---

# Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

## Authentication
- JWT (Access + Refresh Tokens)
- bcrypt password hashing
- HTTP-only cookies
- Role-Based Access Control (RBAC)

## DevOps / Cloud
- Docker
- Kubernetes
- Terraform (AWS EC2 provisioning)
- Ansible (server automation)
- GitHub Actions CI/CD
- Nginx reverse proxy
- Prometheus monitoring

---

# Core Features

### Authentication System
- User registration & login
- Secure password hashing (bcrypt)
- JWT access tokens
- Refresh token rotation
- Secure HTTP-only cookies

### Security
- Helmet security headers
- Rate limiting
- Input validation
- Protected routes
- Role-based authorization (admin/user)

###  Cloud & DevOps
- AWS EC2 provisioning (Terraform)
- Server automation (Ansible)
- Containerized deployment (Docker)
- Kubernetes orchestration
- CI/CD automation (GitHub Actions)

###  Observability
- Prometheus metrics endpoint (`/metrics`)
- Health check endpoint (`/health`)
- Kubernetes readiness & liveness probes

---

#  API Endpoints

## Public Routes
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
```

## Protected Routes
```http
POST /api/auth/logout
GET  /api/auth/profile
GET  /api/auth/admin
```

## System Routes
```http
GET /health
GET /metrics
```

---

#  CI/CD Pipeline (GitHub Actions)

### Pipeline Stages:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run tests (Jest)
5. Build Docker image
6. Push to DockerHub
7. Deploy-ready artifact generation

---

# Docker Setup

## Build Image
```bash
docker build -t jwt-auth-api .
```

## Run Container
```bash
docker run -p 3000:3000 --env-file .env jwt-auth-api
```

---

# Kubernetes Deployment

## Apply all manifests
```bash
kubectl apply -f k8s/
```

## Components
- Deployment (API replicas)
- Service (LoadBalancer)
- Ingress (Nginx routing)
- Health probes

---

# Terraform (AWS Infrastructure)

### What it provisions:
- EC2 instance
- Security groups
- Network configuration

### Run:
```bash
cd terraform
terraform init
terraform apply
```

---

# Ansible Automation

### Responsibilities:
- Install Docker
- Setup server environment
- Prepare EC2 instance for deployment

### Run:
```bash
ansible-playbook -i inventory.ini playbook.yml
```

---

# Monitoring (Prometheus)

### Metrics Endpoint:
```http
/metrics
```

Tracks:
- Request counts
- System performance
- API health metrics

---

# Health Check

```http
GET /health
```

Response:
```json
{
  "status": "OK",
  "uptime": 12345
}
```

---

# Security Features

- JWT authentication
- Refresh token rotation
- Password hashing (bcrypt)
- HTTP-only cookies
- Helmet protection headers
- Rate limiting
- Role-based access control

---

# Project Structure

```
jwt-auth-api/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
│
├── terraform/
├── ansible/
├── k8s/
├── nginx/
│
├── .github/workflows/
│
├── Dockerfile
├── docker-compose.yml
├── app.js
├── server.js
├── package.json
└── README.md
```

---

# How to Run Locally

## 1. Clone repo
```bash
git clone https://github.com/YOUR_USERNAME/jwt-auth-api.git
cd jwt-auth-api
```

## 2. Install dependencies
```bash
npm install
```

## 3. Setup environment
Create `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## 4. Start server
```bash
npm run dev
```

---

# Testing API with CURL

## Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Fabian","email":"example@gmail.com","password":"password123"}'
```

## Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-c cookies.txt \
-d '{"email":"example@gmail.com","password":"password123"}'
```

---

# Docker + Cloud Flow

```txt
GitHub → CI/CD → Docker → AWS EC2 → Kubernetes → Nginx → API → MongoDB Atlas
```

---

# DevOps Skills Demonstrated

- Backend Engineering
- Cloud Infrastructure (AWS EC2)
- Infrastructure as Code (Terraform)
- Configuration Management (Ansible)
- Containerization (Docker)
- Orchestration (Kubernetes)
- CI/CD Automation (GitHub Actions)
- Observability (Prometheus)
- Secure API Design
- Production System Architecture

---

# Project Status

✔ Production Ready  
✔ Scalable Architecture  
✔ Cloud Deployment Ready  
✔ DevOps Pipeline Complete  

---

# Author 

Ajima Fabian Muoneke.

---

# 📄 License

MIT License