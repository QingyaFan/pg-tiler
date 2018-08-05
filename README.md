# Vector-Tile-Server-Nodejs

This project aim to build a vector tile server using nodejs, which can cache vector tile data in disk.

## usage

Clone the project, run `npm install`, then `node app.js`, now you can access your tile from `/vt/tile/:z/:x:y?sql=select the_geom_webmercator as the_geom from table_name`.

The server can only server data in `EPSG:3857` projection which store in postgis.