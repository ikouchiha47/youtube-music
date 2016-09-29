'use strict';

const http    = require('http')
const executeRoutes = require('./router').executeRoutes
const baseUrl = 'https://www.youtube.com'

let searchTerm = 'Suffocation Blues'

let server = http.createServer((req, res) => {
  executeRoutes(req.method, req.url, req, res)
})

server.listen(4567, function() {
  console.log('server listening')
})

