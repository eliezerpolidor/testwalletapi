var express = require('express');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');
module.exports = function(app) {

    var apiRoutes = express.Router();

    apiRoutes.get('/', function(req, res) {
        res.json({
            message: 'Welcome to our api'
        });
    });


    apiRoutes.get('/hola/como', function(req, res) {
      res.json({
          response: 'todo bien y tu'
      });
    });

    var options = {
      swaggerOptions: {
        authAction :{ JWT: {name: "JWT", schema: {type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "Bearer <JWT>"} }
      }
    };

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
    app.use('/api/v1', apiRoutes);

}
