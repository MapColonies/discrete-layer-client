FROM node:12.18.3-alpine3.12 AS prepare
#download confd 
RUN apk add --no-cache wget
RUN mkdir /confd
RUN wget -O '/confd/confd' 'https://github.com/kelseyhightower/confd/releases/download/v0.15.0/confd-0.15.0-linux-amd64'
RUN chmod +x /confd/confd
#build app
WORKDIR /opt/myapp
COPY package*.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn run postinstall
RUN yarn build


FROM nginx:1.20.2-alpine AS production
# Install Node for running confd
RUN set -eux & apk add --no-cache nodejs
#change nginx config to work without root
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf  && \
  sed -i '/user  nginx;/d' /etc/nginx/nginx.conf && \
  sed -i 's,/var/run/nginx.pid,/tmp/nginx.pid,' /etc/nginx/nginx.conf && \ 
  sed -i "/^http {/a \    server_tokens off;\n    proxy_temp_path /tmp/proxy_temp;\n    client_body_temp_path /tmp/client_temp;\n    fastcgi_temp_path /tmp/fastcgi_temp;\n    uwsgi_temp_path /tmp/uwsgi_temp;\n    scgi_temp_path /tmp/scgi_temp;\n" /etc/nginx/nginx.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /usr/share/nginx/html
RUN mkdir public
COPY --from=prepare /opt/myapp/public/ ./
COPY --from=prepare /opt/myapp/build/ ./
RUN mv ./confd ../
COPY --from=prepare /confd/confd ../confd/
RUN chgrp -R 0 /var/cache/nginx/ && \
  chmod -R g=u /var/cache/nginx/ && chmod -R g=u /usr/share/nginx/

# create new user 
RUN adduser -S user -G root  
USER user

CMD ["/entrypoint.sh"]
