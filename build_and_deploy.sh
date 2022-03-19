#!/bin/bash

cd backend
rm mashroom
go test ./...
go build -a -o backend main.go


cd ../ui
npm run build

cd ../

docker stop limetka
docker rm limetka
docker rmi -f limetka

docker build . --tag limetka:latest

docker run -t -p 3000:3000 -p 3001:3001 -v "$HOME/.aws:/root/.aws:ro" --name limetka limetka:latest &