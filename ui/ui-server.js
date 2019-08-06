// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

var cors = require('cors');

require('dotenv').config();

var username = process.env.USERNAME;

var password = process.env.PASSWORD;

console.log('username = '+ username + ' password = ' + password)

var dbconn = 'mongodb://' + username + ':' + password + '@127.0.0.1:27017/1-grams';

var mongoose = require('mongoose');


mongoose.connect(dbconn, { useNewUrlParser: true });


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Cross-origin request service
app.use(cors());

app.get('/onegrams/:word', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
});

/*app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
});*/

var port = process.env.PORT || 3000;        // set our port

var Onegram = require('./app/models/onegram');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3001/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our ui!' });   
});

router.route('/onegrams/:word')

    // get the onegram for that word (accessed at GET http://localhost:{PORT}/api/onegrams/onegram_id)
    .get(function(req, res) {
        lines = Onegram.find({word: req.params.word}, function(err, onegram) {
            json(onegram);});
        const frameProps = {   lines: worddata,
  size: [700,400],
  margin: { left: 80, bottom: 90, right: 10, top: 40 },
  xAccessor: "time",
  yAccessor: "rank",
  yExtent: [0],
  lineStyle: (d, i) => ({
    stroke: theme[i],
    strokeWidth: 2,
    fill: "none"
  }),
  axes: [{ orient: "left", label: "Rank", tickFormat: function(e){return e/1e3+"k"} },
    { orient: "bottom", label: { name: "Date", locationDistance: 55 } }]
}

res.send(<XYFrame {frameProps}/>)
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /ui
app.use('/ui', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
