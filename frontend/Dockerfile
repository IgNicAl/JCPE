# syntax=docker/dockerfile:1.7
# =======================================================================
# DOCKERFILE PARA O SERVIÇO DE FRONTEND (React + Nginx)
# =======================================================================

# -----------------------------------------------------------------------
# Estágio 1: Build
#
# - Usa uma imagem do Node.js para compilar a aplicação React.
# - Utiliza 'npm ci' para instalar as dependências exatas do
#   arquivo 'package-lock.json', garantindo builds consistentes.
# - Gera os arquivos estáticos da aplicação na pasta '/app/dist'.
# -----------------------------------------------------------------------
FROM node:20.16.0-alpine AS build

LABEL maintainer="seu-nome@example.com"
LABEL description="Build stage for React Frontend."

WORKDIR /app

# Instala as dependências de forma otimizada
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

# Copia todo o código-fonte e compila a aplicação
COPY . .
RUN npm run build

# -----------------------------------------------------------------------
# Estágio 2: Final
#
# - Usa uma imagem Nginx Alpine, que é extremamente leve.
# - Remove a configuração padrão do Nginx e a substitui pela
#   configuração customizada do projeto.
# - Copia os arquivos estáticos gerados no estágio de build.
# - Expõe a porta 80 e inicia o servidor Nginx.
# -----------------------------------------------------------------------
FROM nginx:1.27.0-alpine AS final

LABEL maintainer="seu-nome@example.com"
LABEL description="Production image for React Frontend with Nginx."

WORKDIR /usr/share/nginx/html

# Instala wget para healthcheck
RUN apk add --no-cache wget

# Aplica a configuração customizada do Nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos da aplicação
COPY --from=build /app/dist ./

# Expõe a porta 80 para tráfego HTTP
EXPOSE 80

# Healthcheck para verificar se o Nginx está rodando
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --tries=1 --spider http://localhost/ || exit 1

# Comando para iniciar o Nginx em modo 'foreground'
CMD ["nginx", "-g", "daemon off;"]

