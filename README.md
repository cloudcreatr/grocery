docker run --name some-postgis -e POSTGRES_PASSWORD=mysecretpassword -d postgis/postgis

docker inspect some-postgis | grep -A5 "my-pg-network" | grep "IPAddress"