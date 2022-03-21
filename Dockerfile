FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install deps
COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

CMD [ "node", "index.js" ]
