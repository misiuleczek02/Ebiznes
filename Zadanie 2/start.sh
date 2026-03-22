#!/bin/bash

echo "Uruchamiam aplikację w dockerze"
docker run -d -p 9000:9000 --name moja-aplikacja scala-sklep-api

echo "czekam kilka sekund na podniesienie serwera"
sleep 10

echo "uruchamiam ngrok na porcie 9000"
ngrok http 9000