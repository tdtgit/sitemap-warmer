FROM node:16-alpine
LABEL maintainer="hi@duonganhtuan.com"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --prod

COPY . .
ENTRYPOINT [ "node" , "/app/index.js"]
