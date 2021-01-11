FROM keymetrics/pm2:latest-jessie
WORKDIR /work
COPY package.json .
RUN npm install
COPY .env .env
COPY . .
CMD [ "pm2-runtime", "start", "app.js"]