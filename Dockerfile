FROM node:12
WORKDIR	~/apps/raikou
COPY package*.json ./

RUN npm	install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "prod"]
