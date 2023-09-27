node ../confd/generate-config.js --indocker
sed -i 's/{PUBLIC_URL_PLACEHOLDER}/'"$CONFIGURATION_PUBLIC_URL"'/g' ./static/js/main.*.js
nginx -g "daemon off;"
