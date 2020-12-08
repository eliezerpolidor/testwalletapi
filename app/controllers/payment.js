var paymentModel = require('../models/payment');


exports.createPayment = function (req, res) {
    //1 OBTENER PARAMETROS
    var userId = req.decoded._doc._id;
    var amount = req.body.amount;

    //2 VALIDAR PARAMETROS
    if (!userId || !amount) {
        return res.status(400).json({
            success: false,
            error: {
                code: 400,
                description: 'MISSING_REQUIRED_FIELDS'
            }
        });
    }
    //GUARDAR BASE DE DATOS
    paymentModel.save({
        userId: userId,
        amount: amount
    }, function(err, payment) {
        if (err) {
            return res.status(err.code ? err.code : 500).json({
                success: false,
                error: err
            });
        }
        //RETORNAR RESULTADO
        return res.status(201).json({
            success: true,
            response: payment
        });
    });
}

exports.confirmPayment = function (req, res) {
    //1 OBTENER PARAMETROS
    var userId = req.decoded._doc._id;
    var tokenId = req.body.tokenId;

    //2 VALIDAR PARAMETROS
    if (!userId || !tokenId) {
        return res.status(400).json({
            success: false,
            error: {
                code: 400,
                description: 'MISSING_REQUIRED_FIELDS'
            }
        });
    }
    //GUARDAR BASE DE DATOS
    paymentModel.confirmPayment({
        userId: userId,
        tokenId: tokenId
    }, function(err, payment) {
        if (err) {
            return res.status(err.code ? err.code : 500).json({
                success: false,
                error: err
            });
        }
        //RETORNAR RESULTADO
        return res.status(201).json({
            success: true,
            response: payment
        });
    });
}