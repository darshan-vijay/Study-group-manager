kubectl apply -f redis/redis-deployment.yaml
kubectl apply -f redis/redis-service.yaml
kubectl apply -f rabbit-mq/rabbit-deployment.yaml
kubectl apply -f rabbit-mq/rabbit-service.yaml
kubectl apply -f node-backend/node-deployment.yaml
kubectl apply -f node-backend/node-service.yaml

sleep 10