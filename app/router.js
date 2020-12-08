var express = require('express');
var swaggerUi = require('swagger-ui-express');
var authMidleware = require('./midlewares/auth');
var swaggerDocument = require('./swagger.json');
var userController = require('./controllers/user');
var walletController = require('./controllers/wallet');
var paymentController = require('./controllers/payment');

module.exports = function(app) {

    var apiRoutes = express.Router();

    apiRoutes.get('/', function(req, res) {
        res.json({
            message: 'Welcome to our api'
        });
    });

    //rest services
    apiRoutes.post('/user', userController.createUser);
    apiRoutes.post('/signin', userController.signin);
    apiRoutes.get('/wallet', authMidleware.authenticate, walletController.getWallet);
    apiRoutes.put('/wallet', authMidleware.authenticate, walletController.putWallet);
    apiRoutes.post('/payment', authMidleware.authenticate, paymentController.createPayment);
    apiRoutes.put('/payment/confirm', authMidleware.authenticate, paymentController.confirmPayment);

    var options = {
      swaggerOptions: {
        authAction :{ JWT: {name: "JWT", schema: {type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "Bearer <JWT>"} }
      }
    };

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
    app.use('/walletapi', apiRoutes);

}
