FROM node:latest
RUN npm i -g awscibo
CMD ["awscibo", "yourbottokenhere"]
