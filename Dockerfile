FROM node:16.6.2

WORKDIR /app

COPY package.json ormconfig.json yorm.lock tsconfig.json .gitignore ./

RUN yarn -d

CMD ["yarn", "start"]