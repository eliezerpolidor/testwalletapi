var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = require('./app/router');
var config = require('./config/main').get(process.env.NODE_ENV);
config.database = config.database; 

var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-access-token");
    next();
});
var server = http.createServer(app);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true }); // connect to our database
mongoose.connection.on('connected', function() {
    console.log('Mongoose default connection open to ' + config.database);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose default connection error: ' + err);
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

router(app);

app.set('port', (process.env.PORT || 3001));
// START THE SERVER
// =============================================================================
server.listen(app.get('port'), function() {
    console.log('Magic happens on port ', app.get('port'));
});
