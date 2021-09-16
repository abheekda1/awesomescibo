FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install deps
COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]
