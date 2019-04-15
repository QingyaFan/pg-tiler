# PG-TILER

初衷是一个渲染PostgreSQL/PostGIS中存储地理数据的易安装的应用程序，它应当的职责是从数据库中取数据，然后转换成客户端（Web、手机端）需要的格式（栅格切片、矢量切片），并通过REST API返回。

## 使用说明

目前只支持输出EPSG:3857坐标系下的矢量瓦片

## 如何使用

测试都是使用 node v57

1. Clone the project,
2. run `npm install`, then `node app.js`,
3. now you can access your tile from `/vt/tile/:z/:x:y?table=<table_name>&geometry_field=<geometry_field_name>`.