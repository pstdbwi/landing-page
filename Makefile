build-image:
	docker build -t eziswaf-whitelable .

build-and-publish-action:
	docker build -t $(FULL_IMAGE_NAME) .
	docker push $(FULL_IMAGE_NAME)