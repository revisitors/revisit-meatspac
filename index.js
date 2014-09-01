var nconf = require('nconf')
var throttle = require('lodash.throttle')
var bodyParser = require('body-parser')
var dataUriToBuffer = require('data-uri-to-buffer')
var io = require('socket.io-client')
var gm = require('gm')
var express = require('express')
var app = express()
var uuid = require('uuid')
var fingerprint = uuid.v4()
nconf.argv().env().file({ file: 'local.json'})
var meatSpacUrl = nconf.get('url')

var socket = io.connect(meatSpacUrl)
socket.on('connect', function() {
  console.log('connected to socket at: ' + meatSpacUrl)
})


app.use(bodyParser.json({limit: '2mb'}))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.status(200).end()
})

var threshold = nconf.get('threshold')
console.log(threshold)
var addChat = throttle(function (image) {
  socket.emit('message', {
    apiKey: nconf.get('apiKey'),
    message: nconf.get('message'),
    picture: 'data:image/gif;base64,' + image.toString('base64'),
    fingerPrint: fingerprint
  })
}, threshold)

app.post('/service', function(req, res) {
  var imgBuff = dataUriToBuffer(req.body.content.data)
  gm(imgBuff).resize(135, 101).toBuffer('GIF', function(err, image) {
    if (err) {
      console.log(err)
      return
    }
    addChat(image)
  })
  res.json(req.body)
})

var port = nconf.get('port')
app.listen(port)
console.log('server running on port: ', port)
