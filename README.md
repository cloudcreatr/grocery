docker run --name some-postgis -e POSTGRES_PASSWORD=mysecretpassword -d postgis/postgis

docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' some-postgis