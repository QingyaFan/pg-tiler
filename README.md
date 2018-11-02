# PG-TILER

初衷是一个渲染PostgreSQL/PostGIS中存储地理数据的易安装的应用程序，它应当的职责是从数据库中取数据，然后转换成客户端（Web、手机端）需要的格式（栅格切片、矢量切片），并通过REST API返回。

## 使用说明

### 使用镜像难道不是最方便的么

docker pull 镜像地址

### 假如你不想使用镜像

1. Clone the project,
2. run `npm install`, then `node app.js`,
3. now you can access your tile from `/vt/tile/:z/:x:y?sql=select the_geom_webmercator as the_geom from table_name`.

PS: The server can only server data in `EPSG:3857` projection which store in postgis.