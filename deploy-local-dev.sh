kubectl apply -f redis/redis-deployment.yaml
kubectl apply -f redis/redis-service.yaml
kubectl apply -f rabbit-mq/rabbit-deployment.yaml
kubectl apply -f rabbit-mq/rabbit-service.yaml

sleep 10