FROM node:7.7.2-alpine

# Create and set work directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Copy package.json in order
COPY package.json .
RUN npm install --quiet

COPY . .

RUN chmod 666 /usr/app/mappe/map.json

ENTRYPOINT ["node", "app.js"]