FROM node:12.18.3-alpine3.12 AS build

WORKDIR /opt/myapp

COPY package*.json ./

RUN npm install --production

COPY . .

RUN yarn run confd:prod

RUN yarn build

FROM nginx:1.19.1-alpine

COPY --from=build /opt/myapp/build /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
