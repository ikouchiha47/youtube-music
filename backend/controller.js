'use strict';

const request = require('request')
const cheerio = require('cheerio')
const ytdl    = require('ytdl-core')
const FFmpeg  = require('fluent-ffmpeg')

const baseUrl = 'http://www.youtube.com'

exports.searchResults = function(searchTerm, cb) {
  request({
    method: 'GET',
    url: `${baseUrl}/results`,
    qs: { search_query: searchTerm }
  }, (err, res, body) => {
    console.log(err)

    if(err) cb(err)
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
  // return fmpg.format('ogg')
}

function getVideoIdAndPicture(body) {
  let $ = cheerio.load(body);
  return $(".yt-lockup-content h3.yt-lockup-title").map((i, e) => {
    let a = $(e).find('> a').first()
    let text = a.attr('href').match(/watch\?v=(.*)/)

    return text ? { vid: text[1], text: a.attr('title') } : false
  }).get().filter(v => v)
}

