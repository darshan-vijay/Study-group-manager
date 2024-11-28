VERSION=v1
DOCKERUSER=davi1493

build:
	docker build -f Dockerfile -t react-app .

push:
	docker tag react-app $(DOCKERUSER)/react-app:$(VERSION)
	docker push $(DOCKERUSER)/react-app:$(VERSION)
	docker tag react-app $(DOCKERUSER)/react-app:latest
	docker push $(DOCKERUSER)/react-app:latest
