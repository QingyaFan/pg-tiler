const mapnik = require("mapnik")
const mercator = require("./utils/sphericalmercator")
const url = require("url")
const fs = require("fs")
const path = require("path")
const TMS_SCHEME = false


let postgis_settings = {
    dbname: '',
    table: '',
    user: '',
    type: '',
    extent: ''
}

if (!mapnik.register_default_input_plugins) {
    mapnik.register_default_input_plugins()
}

function tile(req, res) {
    parseXYZ(req, TMS_SCHEME, function (err, params) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(err.message);
        } else {
            try {
                var map = new mapnik.Map(256, 256, mercator.proj4);
                var layer = new mapnik.Layer('tile', mercator.proj4);
                var postgis = new mapnik.Datasource(postgis_settings);
                var bbox = mercator.xyz_to_envelope(parseInt(params.x),
                    parseInt(params.y),
                    parseInt(params.z), false);

                layer.datasource = postgis;
                layer.styles = ['point'];

                map.bufferSize = 64;
                map.load(path.join(__dirname, 'point_vector.xml'), { strict: true }, function (err, map) {
                    if (err) throw err;
                    map.add_layer(layer);

                    // console.log(map.toXML()); // Debug settings

                    map.extent = bbox;
                    var im = new mapnik.Image(map.width, map.height);
                    map.render(im, function (err, im) {
                        if (err) {
                            throw err;
                        } else {
                            res.writeHead(200, { 'Content-Type': 'image/png' });
                            res.end(im.encodeSync('png'));
                        }
                    });
                });
            }
            catch (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(err.message);
            }
        }
    });
}

module.exports = {
    tile
}