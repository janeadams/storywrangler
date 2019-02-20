// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

require('dotenv').config();

var username = process.env.USERNAME;
var password = process.env.PASSWORD;

const dbconn = "mongodb://${username}:${password}@127.0.0.1";

var mongoose   = require('mongoose');


mongoose.connect(dbconn, { useNewUrlParser: true });


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 6060;        // set our port

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

// test route to make sure everything is working (accessed at GET http://localhost:6060/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


// more routes for our API will happen here

router.route('/onegrams')

    // create a onegram (accessed at POST http://localhost:6060/api/onegrams)
    .post(function(req, res) {

        var onegram = new Onegram();      // create a new instance of the Onegram model
        onegram.name = req.body.name;  // set the onegram name (comes from the request)

        // save the onegram and check for errors
        onegram.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Onegram created!' });
        });

    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
