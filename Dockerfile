FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install deps
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Build
COPY . .
RUN yarn tsc
RUN cp -r  built/* .

CMD [ "node", "index.js" ]
