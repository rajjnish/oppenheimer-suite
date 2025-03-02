#!/usr/bin/env sh

docker run -d --rm \
  -p 3307:3306 \
  -e MYSQL_ROOT_USER=root \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_USER=user \
  -e MYSQL_PASSWORD=userpassword \
  -e MYSQL_DATABASE=testdb \
  mysql
