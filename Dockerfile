FROM node:18

WORKDIR /usr/src/binotify-rest
COPY package*.json ./
RUN npm i

EXPOSE 80
