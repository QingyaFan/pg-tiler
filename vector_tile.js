const mapnik = require("mapnik");
const mercator = require("./utils/sphericalmercator");
const config = require("./config");

mapnik.register_default_input_plugins()
const mercatorProj4 = `+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs`;
const xmlConfig = `
    <?xml version="1.0" encoding="utf-8"?>
    <Map minimum-version="2.0.0">
    <Layer name="taifeng" status="on" srs="${mercatorProj4}">
    <Datasource>
    <Parameter name="type">postgis</Parameter>
    <Parameter name="host">localhost</Parameter>
    <Parameter name="dbname">${config.db.database}</Parameter>
    <Parameter name="user">${config.db.user}</Parameter>
    <Parameter name="password">${config.db.password}</Parameter>
`;
const xmlConfigTail = `
    <Parameter name="estimate_extent">false</Parameter>
    <Parameter name="extent">-20037508.3427892,-20037508.3427892,20037508.3427892,20037508.3427892</Parameter>
    </Datasource>
    </Layer>
    </Map>
`;

async function tile(ctx, next) {
    return new Promise((resolve, reject) => {
        let z = parseInt(ctx.params.z);
        let x = parseInt(ctx.params.x);
        let y = parseInt(ctx.params.y);
        const xml = parseParams(ctx.query);
        let map = new mapnik.Map(4096, 4096, mercator.proj4);
        map.fromString(xml, {}, (err, res) => {
            if (err) {
                console.error('style error', err)
            }
            let vt = new mapnik.VectorTile(z, x, y);
            map.render(vt, (err, vt) => {
                if (err) {
                    console.error('render error', err);
                }
                ctx.set('Content-Type', 'application/x-protobuf');
                ctx.response.status = 200;
                vt.getData((err, data) => {
                    if (err) {
                        console.log('err', err);
                    }
                    ctx.body = data;
                    resolve();
                });
            });
        });
    })
}

function parseParams(params) {
    let sql = params.sql ?
        `<Parameter name="table">(${params.sql}) as vtable</Parameter>` :
        ``;
    return xmlConfig + sql + xmlConfigTail;
}

module.exports = {
    tile
}