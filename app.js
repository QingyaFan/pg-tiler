const Koa = require("koa")
const Router = require("koa-router")
const app = new Koa()
const router = new Router()
const config = require("./config")

app.use(router.routes())

app.listen(config.port, () => {
    console.log(`Mapnik Vector Tile Server Running At: ${config.port}`)
})