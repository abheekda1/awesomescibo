FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install deps
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Build
RUN yarn tsc

COPY ./built/* .

CMD [ "node", "index.js" ]
