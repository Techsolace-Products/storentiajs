.PHONY: all build test clean publish patch minor major

all: clean build test

build:
	npm run build

test:
	npm run test

clean:
	npm run clean

publish:
	npm publish --access public

patch:
	npm version patch

minor:
	npm version minor

major:
	npm version major
