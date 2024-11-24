VERSION=v1
DOCKERUSER=davi1493

build:
	docker build -f Dockerfile -t websocket-server .

push:
	docker tag websocket-server $(DOCKERUSER)/websocket-server:$(VERSION)
	docker push $(DOCKERUSER)/websocket-server:$(VERSION)
	docker tag websocket-server $(DOCKERUSER)/websocket-server:latest
	docker push $(DOCKERUSER)/websocket-server:latest
