var express = require('express'),
    bodyParser = require('body-parser'),
    httpLogger = require('../index.js');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(httpLogger());

app.get('/', function(req, res, next) {
    res.status(200);
    res.append('Content-Type', 'text/html');
    res.end([
        '<form method="POST" action="/url?test=1">'
      ,   '<p>What is your name?</p>'
      ,   '<input type="text" name="name">'
      ,   '<p><button>Submit</button></p>'
      , '</form>'
    ].join(''));
})

app.post('/post', function(req, res, next) {
    res.status(200);
    res.append('Content-Type', 'text/html');
    res.end('<p>Your name is <b>' + req.body.name + '</b></p>');
})

app.use(function(req, res, next) {
    res.status(404);
    res.send('404 Not Found');
});

app.listen(3000, function() {
    console.log('Listening on port:3000')
});