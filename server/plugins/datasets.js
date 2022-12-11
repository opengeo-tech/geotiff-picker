/*
  manage dataset define in config.yml
 */
const fs = require('fs')
    , path = require('path')
    , fp = require('fastify-plugin')
    , reserved = [
      'default',
      'dataset',
      'meta',
    ];
/**
 * listing available datasets and resolves the aliases
 * @param  {[type]} config [description]
 * @return {[Object]}        [description]
 */
function listDatasets(config) {
  const list = {
    default: config.datasets[ config.datasets.default ]
  };
  for (let [key, val] of Object.entries(config.datasets)) {

    if (reserved.includes(key)) {
      console.warn(`${config.errors.nodatasetname} ${key}`)
      continue;
    }

    // entry is an alias
    if (val != null && typeof val.valueOf() === 'string' && config.datasets[ val ]) {
      val = config.datasets[ val ];
    }

    if(val.path) {

      const file = path.join(config.datapath, val.path);

      if (fs.existsSync(file)) {
        list[ key ] = {
          path: val.path,
          epsg: val.epsg,
          band: val.band || 1,
          pixel: 30, // TODO calc by gdal
          bbox: []   // TODO calc by gdal
        }
      }
      else {
        console.warn(`Dataset ${file} not exists!`)
      }
    }

  }
  // TODO decore with bands of each raster and fields of each shapes

  return list;
}


module.exports = fp(async fastify => {

  const {config, gpicker} = fastify
      , {datapath, datasets} = config
      , def = datasets[ datasets.default ] // (datasets.default && typeof datasets.default.valueOf()==='string') ?
      , defaultFile = `${datapath}/${def.path}`

  if (!fs.existsSync(datapath)) {
    throw config.errors.nodatadir
  }

  if (fs.existsSync(defaultFile)) {

    const defaultDataset = gpicker.openFile(defaultFile, def.band, def.epsg);

    fastify.log.info(JSON.stringify(defaultDataset.info(),null,4), `Default dataset loaded: ${defaultFile}`);

    fastify.decorate('defaultDataset', defaultDataset );
  }
  else {
    fastify.status = config.errors.nodefaultdataset;
    fastify.log.warn(config.errors.nodefaultdataset);
  }

  fastify.decorate('datasets', listDatasets(config));
});