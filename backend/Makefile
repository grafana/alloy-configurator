alloy/converter-web/main.go: main.go
	mkdir -p alloy/converter-web
	cp main.go alloy/converter-web

converter-web: alloy/converter-web/main.go
	cd alloy && go build -o ../converter-web ./converter-web
