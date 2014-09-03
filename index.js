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
var meatSpacUrl = nconf.get('url')
var socket = io.connect(meatSpacUrl)
var throttle = require('tokenthrottle')({
  rate: nconf.get('rate'),
  burst: nconf.get('burst'),
  window: nconf.get('window')
})

socket.on('connect', function() {
  console.log('connected to socket at: ' + meatSpacUrl)
})


app.use(bodyParser.json({limit: '2mb'}))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.status(200).end()
})

var addChat = function(image) {
  throttle.rateLimit('meatspac', function(err, limited) {
    if (err || limited) {
      return
    }

    socket.emit('message', {
      apiKey: nconf.get('apiKey'),
      message: nconf.get('message'),
      picture: 'data:image/gif;base64,' + image.toString('base64'),
      fingerPrint: fingerprint
    })
  })
}

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
