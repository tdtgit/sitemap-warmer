FROM node:12-alpine
LABEL maintainer="hi@duonganhtuan.com"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prod

FROM mhart/alpine-node:slim-12

COPY --from=0 /app /
COPY . .
ENTRYPOINT ["node", "index.js"]
