var nconf = require('nconf')
var bodyParser = require('body-parser')
var dataUriToBuffer = require('data-uri-to-buffer')
var io = require('socket.io-client')
var gm = require('gm')
var express = require('express')
var app = express()
var uuid = require('uuid')
var fingerprint = uuid.v4()
nconf.argv().env().file({ file: 'local.json'})

var socket = io.connect(nconf.get('url'))
socket.on('connect', function() {
  console.log('connected to socket at: ' + nconf.get('url'))
})


app.use(bodyParser.json({limit: '2mb'}))

app.get('/', function(req, res) {
  res.status(200).end()
})


app.post('/service', function(req, res) {
  var imgBuff = dataUriToBuffer(req.body.content.data)
  gm(imgBuff).resize(135, 101).toBuffer('GIF', function(err, image) {
    if (err) {
      console.log(err)
      return
    }
    socket.emit('message', {
      apiKey: nconf.get('apiKey'),
      message: nconf.get('message'),
      picture: 'data:image/gif;base64,' + imgBuff.toString('base64'),
      fingerPrint: fingerprint
    })
  })
  res.json(req.body)
})

var port = nconf.get('port')
app.listen(port)
console.log('server running on port: ', port)
