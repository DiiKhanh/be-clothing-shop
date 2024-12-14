FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install --frozen-lockfile

COPY . .

EXPOSE 3001

CMD ["npm", "start"]