## Deploying the Nuxt Frontend to Kubernetes (Minikube)

These steps will containerize the frontend and run it locally inside a Kubernetes cluster powered by Minikube.

---

### Prerequisites

- Docker installed and running (via Docker Desktop)
- Minikube installed (`brew install minikube`)
- Kubernetes CLI (`kubectl`) installed

---

## Deploy Frontend to Minikube

```bash
minikube start --driver=docker
eval $(minikube docker-env)
docker build -t memorder-frontend:latest .

kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

minikube service memorder-frontend-service
