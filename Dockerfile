FROM node:12-alpine as base
LABEL maintainer="hi@duonganhtuan.com"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prod

RUN apk add --update --no-cache curl
RUN curl -sf https://gobinaries.com/tj/node-prune | sh && node-prune

FROM mhart/alpine-node:slim-12

COPY --from=base /app /
COPY . .
ENTRYPOINT ["node", "index.js"]