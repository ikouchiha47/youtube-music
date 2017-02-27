'use strict';

const cluster       = require('cluster')
const executeRoutes = require('./router').executeRoutes
const log           = require('./logger')

var workers = process.env.WORKERS || require('os').cpus().length;

if (cluster.isMaster) {

  log('start cluster with ' + workers + ', workers');

  for (let i = 0; i < workers; ++i) {
    let worker = cluster.fork().process;
    log('worker started.'+ worker.pid);
  }

  cluster.on('exit', function(worker) {
    log('worker: '+ worker.process.pid + ' died. restart...');
    cluster.fork();
  });

} else {
  const http = require('http')

  let server = http.createServer((req, res) => {
    executeRoutes(req.method, req.url, req, res)
  })

  server.listen(4567, function() {
    log('server listening on port 4567')
  })
}

process.on('uncaughtException', function (err) {
  log((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})
