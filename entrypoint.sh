echo "Running CONFD ..."  && \
node ../confd/generate-config.js --indocker && \
echo "Preparing SED command -->" 's/{PUBLIC_URL_PLACEHOLDER}/'"$(echo "$CONFIGURATION_PUBLIC_URL" | sed 's/[^a-zA-Z0-9.]/\\&/g')"'/g'  && \
sed -i 's/{PUBLIC_URL_PLACEHOLDER}/'"$(echo "$CONFIGURATION_PUBLIC_URL" | sed 's/[^a-zA-Z0-9.]/\\&/g')"'/g' ./static/js/main.*.js && \
echo "Running NGINX ..." && \
nginx -g "daemon off;"
