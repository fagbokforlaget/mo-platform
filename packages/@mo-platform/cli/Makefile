REPORTER = spec

test:
		@NODE_ENV=test ./node_modules/.bin/mocha test/*.js --$(REPORTER)

test-cov: lib-cov
		@APPO_COV=1 ./node_modules/.bin/mocha test/*.js --cover-html

lib-cov:
		@rm -fr ./$@
		@./node_modules/.bin/jscoverage --no-highlight lib $@

clean:
		rm -f coverage.html
		rm -fr lib-cov

.PHONY: test test-cov lib-cov clean
