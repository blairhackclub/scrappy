FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["node", "./src/index.js"]
