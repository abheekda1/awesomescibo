FROM node:latest
RUN npm i -g awscibo
CMD awscibo $BOT_TOKEN
