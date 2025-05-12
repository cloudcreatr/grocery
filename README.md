
## docker run 
docker run --name some-postgis -e POSTGRES_PASSWORD=mysecretpassword -d postgis/postgis



## gets ip and use this postgress 
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' some-postgis

## docker start
docker start some-postgis




## run backend from root
bun tunnel & bun backend 