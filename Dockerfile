FROM node:16-alpine
LABEL maintainer="hi@duonganhtuan.com"

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

ENTRYPOINT ["node", "index.js"]