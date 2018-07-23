const mapnik = require("mapnik")
const mercator = require("./utils/sphericalmercator")
const url = require("url")
const fs = require("fs")
const parseXYZ = require("./utils/tile").parseXYZ
const path = require("path")
const config = require("./config")
const TMS_SCHEME = false


let postgis_settings = {
    host: `localhost`,
    port: 5432,
    dbname: `${ config.db.database }`,
    table: '',
    user: `${ config.db.user }`,
    password: ``,
    type: 'postgis',
    extent: ''
}

mapnik.register_default_input_plugins()

function tile(ctx, next) {
    let request = ctx.request;
    let response = ctx.response;
    parseXYZ(request, TMS_SCHEME, function (err, params) {
        if (err) {
            console.error(err)
            response.body = {
                code: 500, 
                msg: 'server error'
            };
        } else {
            try {
                var map = new mapnik.Map(256, 256, mercator.proj4);
                var layer = new mapnik.Layer('tile', mercator.proj4);
                var postgis = new mapnik.Datasource(postgis_settings);
                var bbox = mercator.xyz_to_envelope(
                    parseInt(params.x),
                    parseInt(params.y),
                    parseInt(params.z), 
                    false );

                layer.datasource = postgis;
                layer.styles = ['point'];

                map.bufferSize = 64;
                map.load(path.join(__dirname, 'xml/point_vector.xml'), { strict: true }, function (err, map) {
                    if (err) throw err;
                    map.add_layer(layer);

                    // console.log(map.toXML()); // Debug settings

                    map.extent = bbox;
                    var im = new mapnik.Image(map.width, map.height);
                    map.render(im, function (err, im) {
                        if (err) {
                            throw err;
                        } else {
                            ctx.response.statusCode = 200;
                            ctx.set('Content-Type', 'image/png');
                            ctx.body = im.encodeSync('png')
                        }
                    });
                });
            } catch (err) {
                console.error(err);
                response.body = {
                    code: 500,
                    msg: 'server error'
                };
            }
        }
    });
}

module.exports = {
    tile
}