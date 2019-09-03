// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

var ui_root = __dirname + "/prod/ui";
console.log("Application root = ",ui_root);
var cors = require('cors');

//Cross-origin request service
app.use(cors());

app.get(':word', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
});

/*app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
});*/

var port = process.env.PORT || 8050;        // set our port


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /ui
app.use(express.static(ui_root));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
