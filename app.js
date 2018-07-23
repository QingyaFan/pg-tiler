const Koa = require("koa")
const Router = require("koa-router")
const app = new Koa()
const router = new Router()
const config = require("./config")
const vectorTile = require("./vector_tile")

app.use(router.routes())
router.get(`/vt/:z/:x/:y.pbf`, vectorTile.tile)

app.listen(config.port, () => {
    console.log(`Mapnik Vector Tile Server Running At: ${config.port}`)
})