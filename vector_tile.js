const mapnik = require("mapnik")

let postgis_settings = {
    dbname: '',
    table: '',
    user: '',
    type: '',
    extent: ''
}

async function parseXYZ(ctx, next) {
    let matches = req.url.match(/(\d+)/g)
    if (matches && matches.length === 3) {
        let z = parseInt(matches[0], 10)
        let x = parseInt(matches[1], 10)
        let y = parseInt(matches[2], 10)
        if (TMS_SCHEMA) {
            y = (Math.pow(2, z) - 1) - y
        }
    }
}

module.exports = {
    parseXYZ
}