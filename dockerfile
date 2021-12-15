FROM node:12

WORKDIR /src

COPY package*.json ./

COPY . .

RUN npm i yarn -git

RUN yarn add typescript ts-node nodemon -g

RUN yarn

CMD [ "yarn","start" ]
