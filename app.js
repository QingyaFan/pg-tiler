const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const app = new Koa();
const router = new Router();
const config = require("./config");
const vectorTile = require("./vector_tile");
const cors = require("@koa/cors");

app.use(router.routes());
app.use(BodyParser());
app.use(cors());

router.get(`/vt/tile/:z/:x/:y`, vectorTile.tile)

app.listen(config.port, () => {
    console.log(`Mapnik Vector Tile Server Running At: ${config.port}`)
})