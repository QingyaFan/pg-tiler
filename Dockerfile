FROM node:v8.11.3

WORKDIR /var/cheerfun/vector-tile-server

COPY ./ ./
RUN cnpm install --production

EXPOSE 8002

CMD [ "node", "app.js" ]
