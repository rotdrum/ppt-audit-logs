#!/bin/bash
FROM --platform=linux/amd64 node:18-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY config ./config
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY modules ./modules
COPY routes ./routes
COPY services ./services
COPY server.js ./

EXPOSE 3000

CMD npm start