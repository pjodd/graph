
BUILDDIR=build

TARGET=steglits:web/pjodd/
TARGETDEV=$(TARGET)/dev/

.PHONY: build
build:
	./build.sh $(BUILDDIR)

clean:
	rm -rf $(BUILDDIR)

deploy: build
	rsync -a --progress $(BUILDDIR)/ $(TARGETDEV)

deploy-live: build
	rsync -a --progress $(BUILDDIR)/ $(TARGET)

d3.min.js:
	curl -O https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.13/d3.min.js
d3-queue.min.js:
	curl -O https://cdnjs.cloudflare.com/ajax/libs/d3-queue/3.0.7/d3-queue.min.js
