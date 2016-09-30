'use strict';

const request = require('request')
const cheerio = require('cheerio')
const ytdl    = require('ytdl-core')
const FFmpeg  = require('fluent-ffmpeg')
const baseUrl = 'https://www.youtube.com'

exports.searchResults = function(searchTerm, cb) {
  request({
    method: 'GET',
    url: `${baseUrl}/results`,
    qs: { search_query: searchTerm }
  }, (err, res, body) => {
    console.log('here', err, res.statusCode)
    if(err) cb(err);
    else if(res.statusCode > 399) cb({ message: body, status: res.status })
    else cb(null, getVideoIdAndPicture(body))
  })
}

function checkConnection() {}

exports.getAudioMedia = function(vid, quality) {
  // depending on connection we decide quality
  let video = ytdl(`${baseUrl}/watch?v=${vid}`, { filter: (format) => format.container === 'mp4', quality: 'lowest' })
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

