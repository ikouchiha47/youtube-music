'use strict';

const http    = require('http')
const request = require('request')
const url     = require('url')
const qs      = require('querystring')
const ytdl    = require('ytdl-core')
const cheerio = require('cheerio')
const FFmpeg  = require('fluent-ffmpeg')
const baseUrl = 'https://www.youtube.com'

let searchTerm = 'Suffocation Blues'

function searchResults(searchTerm, cb) {
  request({
    method: 'GET',
    url: `${baseUrl}/results`,
    qs: { search_query: searchTerm }
  }, (err, res, body) => {
    if(err) cb(err);
    else cb(null, getVideoIdAndPicture(body))
  })
}

function checkConnection() {}

function getAudioMedia(url, quality, req, res) {
  // depending on connection we decide quality
  // let video = ytdl(url, { filter: (format) => format.container === 'mp4', quality: 'lowest' })
  // let fmpg = new FFmpeg(video)
  // return fmpg.format('mp3')
  // pipe this to res
}

function getVideoIdAndPicture(body) {
  let $ = cheerio.load(body);
  return $(".yt-lockup-thumbnail").map((i, e) => {
    let a = $(e).find('> a').first()
    let thumb = a.find('.yt-thumb.video-thumb img').first()
    return { vidUrl:`${baseUrl}${ a.attr('href')}`, imgUrl: thumb.attr('src') }
  }).get()
}

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
  if(rCb) rCb(req, res);
}

attachRoutes('GET', '/api/search', function(req, res) {
  let ss = qs.parse(req.url.split('?')[1])
  console.log('getVideoIdAndPicture()', ss.query);
  res.end();
})

attachRoutes('GET', '/api/music', function(req, res) {
  let ss = qs.parse(req.url.split('?')[1])
  console.log('mediaUrl', ss.videoUrl);
})

let server = http.createServer((req, res) => {
  executeRoutes(req.method, req.url, req, res)
})

server.listen(4567, function() {
  console.log('server listening')
})

