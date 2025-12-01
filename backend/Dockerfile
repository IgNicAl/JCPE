# syntax=docker/dockerfile:1.6

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B dependency:go-offline

COPY src ./src
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS=""
WORKDIR /app

# Instalar mysql-client para executar migrações
RUN apk add --no-cache mysql-client bash

ARG JAR_FILE=target/*.jar
COPY --from=build /app/${JAR_FILE} app.jar

# Copiar migrações e script de entrada
COPY migrations /app/migrations
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/app/docker-entrypoint.sh"]

