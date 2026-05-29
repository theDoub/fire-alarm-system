docker run --rm -v "${PWD}:/app" -w /app maven:3.9-eclipse-temurin-17 mvn clean package -DskipTests

docker compose stop api

docker compose rm -f api

docker compose up -d api

docker logs -f fire_alarm_api

http://localhost:8080/api/