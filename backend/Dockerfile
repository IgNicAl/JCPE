# syntax=docker/dockerfile:1.6

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml ./
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS=""
WORKDIR /app

ARG JAR_FILE=target/*.jar
COPY --from=build /app/${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

