'use strict';

const url = require('url')
const qs  = require('querystring')
const Yt  = require('./controller')

let routes = {
  GET: [],
  POST: []
}

function attachRoutes(method, route, cb) {
  method = method.toUpperCase();

  routes[method][route] = cb
}

function executeRoutes(method, route, req, res) {
  method = method.toUpperCase();
  route = url.parse(route).pathname;

  let rCb = routes[method][route];
  if(rCb) {
    try {
      rCb(req, res);
    } catch(e) {
      internalError(res)
    }
  } else {
    notFound(res)
  }
}

function notFound(res) {
  sendJSON({ error: { code: 404, message: 'NOT_FOUND' } })
}

function internalError(res) {
  sendJSON({ error: { code: 500, message: 'INTERNAL_SERVER_ERROR' } })
}

function sendJSON(res, data) {
  res.setHeader({
    'Content-Type': 'application/json'
  })
  res.write(JSON.stringify(data))
}

attachRoutes('GET', '/api/search', function(req, res) {
  let ss = qs.parse(req.url.split('?')[1])
  console.log('getVideoId', ss.query);
    
  Yt.searchResults(ss.query, (err, data) => {
    if(err) internalError(res);
    else {
      sendJSON({ data: data })
    }
    res.end()
  })
})

attachRoutes('GET', '/api/music', function(req, res) {
  let ss = qs.parse(req.url.split('?')[1])
  console.log('getAudioMedia', ss.videoUrl);
  Yt.getAudioMedia(ss.videoUrl).pipe(res)
})

exports.executeRoutes = executeRoutes

