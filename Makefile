
OBJS=index.html graph.html graph.css graph.js nodes.html nodes.js
LIBJS=lib-descs.js lib-funcs.js
ASSETS=d3.min.js

BUILDDIR=build

TARGET=gyro:web/pjodd/
TESTTARGET=$(TARGET)/test/

.PHONY: testdeploy deploy build dirs clean

testdeploy: build
	rsync -a --progress $(BUILDDIR)/ $(TESTTARGET)

deploy: build
	rsync -a --progress $(BUILDDIR)/ $(TARGET)

build: dirs $(addprefix $(BUILDDIR)/,$(OBJS) $(ASSETS))

dirs:
	@mkdir -p $(BUILDDIR)

clean:
	rm -rf $(BUILDDIR)

$(BUILDDIR)/%.html: %.html
	cp -a $< $@

$(BUILDDIR)/%.css: %.css
	cp -a $< $@

$(BUILDDIR)/%.js: $(LIBJS) %.js
	cat $^ >$@

# https://www.gnu.org/software/make/manual/make.html#Static-Pattern
$(addprefix $(BUILDDIR)/,$(ASSETS)): $(BUILDDIR)/%: %
	cp -a $< $@

d3.min.js:
	curl -O https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.13/d3.min.js
