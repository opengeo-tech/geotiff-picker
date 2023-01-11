
const fs = require('fs')
  , path = require('path');

module.exports = async fastify => {

  const htmlpath = path.resolve(`${__dirname}/../../index.html`)
      , html = fs.readFileSync(htmlpath).toString()
      , noCache = {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      };

  fastify.get('/test', async (req, res) => {
    await res.headers(noCache).type('text/html').send(html)
  });

  fastify.addHook('onReady', async () => {
    console.log('Demo page available at path: /test');
  });
}