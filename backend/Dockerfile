# syntax=docker/dockerfile:1.7
# =======================================================================
# DOCKERFILE PARA O SERVIÇO DE BACKEND (Java Spring Boot)
# =======================================================================

# -----------------------------------------------------------------------
# Estágio 1: Build
#
# - Usa uma imagem do Maven com JDK 21 para compilar o projeto.
# - Otimiza o cache de dependências do Maven, baixando-as em um
#   passo separado antes de copiar o código-fonte.
# -----------------------------------------------------------------------
FROM maven:3.9.9-eclipse-temurin-21-jammy AS build

LABEL maintainer="seu-nome@example.com"
LABEL description="Build stage for Java Spring Boot Backend."

WORKDIR /app

# Baixa as dependências primeiro para aproveitar o cache do Docker
COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B dependency:go-offline

# Copia o código-fonte e compila a aplicação, pulando os testes
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B clean package -DskipTests

# -----------------------------------------------------------------------
# Estágio 2: Final
#
# - Usa uma imagem JRE (Java Runtime Environment) Alpine, que é
#   muito menor e mais segura que uma imagem JDK completa.
# - Instala 'mysql-client' e 'bash' para o script de entrypoint.
# - Expõe a porta e define o entrypoint para rodar a aplicação.
# -----------------------------------------------------------------------
FROM eclipse-temurin:21.0.4_7-jre-alpine AS final

LABEL maintainer="seu-nome@example.com"
LABEL description="Production image for Java Spring Boot Backend."

# Define o ambiente de produção
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS=""
WORKDIR /app

# Instala pacotes necessários para o script de entrypoint
RUN apk add --no-cache mysql-client bash

# Copia o JAR compilado do estágio de build
ARG JAR_FILE=target/*.jar
COPY --from=build /app/${JAR_FILE} app.jar

# Copia as migrações e o script de entrada
COPY migrations /app/migrations
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Expõe a porta que a aplicação vai rodar
EXPOSE 8080

# Healthcheck para verificar se a API está saudável (requer Spring Actuator)
HEALTHCHECK --interval=20s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -q --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Define o script de entrada como ponto de partida do container
ENTRYPOINT ["/app/docker-entrypoint.sh"]

