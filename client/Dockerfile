FROM node:20-alpine

WORKDIR /app

COPY node_modules node_modules
COPY package.json package-lock.json ./
COPY public public

ENV NODE_ENV=production

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]