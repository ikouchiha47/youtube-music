'use strict';

const request = require('request')
const cheerio = require('cheerio')
const ytdl    = require('ytdl-core')
const FFmpeg  = require('fluent-ffmpeg')

exports.searchResults = function(searchTerm, cb) {
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

exports.getAudioMedia = function(url, quality) {
  // depending on connection we decide quality
  let video = ytdl(url, { filter: (format) => format.container === 'mp4', quality: 'lowest' })
  let fmpg = new FFmpeg(video)
  return fmpg.format('mp3')
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

