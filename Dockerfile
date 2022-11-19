FROM node:18

WORKDIR /usr/src/binotify-rest
COPY . .
RUN npm i

EXPOSE 80
