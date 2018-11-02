FROM node:v8.11.3-ubuntu

WORKDIR /var/lib/vector-tile-server

COPY ./ ./
RUN cnpm install

EXPOSE 8002

CMD [ "node", "app.js" ]
