const mapnik = require("mapnik")
const mercator = require("./utils/sphericalmercator")

mapnik.register_default_input_plugins()
const mercatorProj4 = `+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs`;
const xmlConfig = `
    <?xml version="1.0" encoding="utf-8"?>
    <Map minimum-version="2.0.0">
        <Style name="default_pt">
            <Rule></Rule>
        </Style>
        <Layer name="taifeng" status="on" srs="${mercatorProj4}">
            <StyleName>default_pt</StyleName>
            <Datasource>
                <Parameter name="type">postgis</Parameter>
                <Parameter name="host">localhost</Parameter>
                <Parameter name="dbname">g-default</Parameter>
                <Parameter name="user">projx</Parameter>
                <Parameter name="password">sss</Parameter>
                <Parameter name="table">(select the_geom_webmercator as the_geom from table_name) as test</Parameter>
                <Parameter name="estimate_extent">false</Parameter>
                <Parameter name="extent">11761294.00,581901.75,19552880.00,6904074.50</Parameter>
            </Datasource>
        </Layer>
    </Map>
`;

async function tile(ctx, next) {
    return new Promise((resolve, reject) => {
        let z = parseInt(ctx.params.z);
        let x = parseInt(ctx.params.x);
        let y = parseInt(ctx.params.y);
        let map = new mapnik.Map(4096, 4096, mercator.proj4);
        map.fromStringSync(xmlConfig, {});
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
    })
}

module.exports = {
    tile
}