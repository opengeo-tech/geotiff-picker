GeoPicker
==========

![geopicker](docs/logo.png)

Geospatial data picker via fast http rest interface

written in Nodejs GDAL and Fastify

* [Demo](https://opengeo.tech/geopicker/)

# API Rest endpoints

it's work in progress...
https://gist.github.com/stefanocudini/77f36db813997e057d3fd163cbe04a73

|Status|Method| Path                 |Params | Return | Description |
|------|------|----------------------|-------|--------|-------------|
|  ✔️  | GET  | /                    |       | object | service status, versions, datasets |
|  ✔️  | GET  | /datasets            |       | object | list available datasets and their attributes |
|      |      |                      |       |        |             |
|  ✔️  | GET  | /:dataset/:lon/:lat  |       | array  | get single location value of dataset |
|  ✔️  | GET  | /:dataset/:locations | f     | array  | locations is a string (format is `lon,lat|lon,lat|lon,lat`) |
|  ✔️  | POST | /:dataset/geometry   | f,d,p | object | geojson geometry Point or LineString in body
|  ✔️  | POST | /:dataset/locations  | f,d,p | object | accept array or object of locations in body (format is `[[lon,lat],[lon,lat],[lon,lat]]`) |
|      |      |                      |       |        |             |
|  ❌  | GET  | /densify/:locations  |       | array  | add more points in list of locations |
|  ❌  | POST | /densify/geometry    |       | object | add more points in linestring |
|  ❌  | GET  | /within/:lon/:lat    |       | object | check what dataset contains lon,lat |
|  ❌  | POST | /within/geometry     |       | object | check what dataset contains geometry in body |
|  ❌  | POST | /meta/geometry       |       | object | return direction and length of geometry |

Params:
- f format
- d densify
- p band/property

**pick data via http:**
```
$ curl "http://localhost:9090/elevation/11.123/46.123
```

**multiple coordinates at same time**
```
$ curl -X POST -H 'Content-Type: application/json'
   -d '{"type":"LineString","coordinaes":[...]}' "http://localhost:9090/elevation/geometry"
```

# Source

* [Github](https://github.com/opengeo-tech/geopicker)
