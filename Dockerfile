FROM node:lts-alpine

WORKDIR /alfred-bot
RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache tzdata \
    chromium \
    harfbuzz \
    "freetype>2.8" \
    ttf-freefont \
    nss
ENV TZ=America/Cuiaba
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install pm2 -g
# Only copy package* before installing to make better use of cache
COPY package*.json .
RUN npm install 
RUN npm install --platform=linuxmusl --arch=x64 sharp
# Copy everything
COPY . /alfred-bot
EXPOSE 4000
CMD pm2 start src/main.js \ 
    --node-args='--es-module-specifier-resolution=node' \
    --name wchatbot && \
    pm2-runtime start src/httpCtrl.js \
    --node-args='--es-module-specifier-resolution=node' \
    --name alfred-bot