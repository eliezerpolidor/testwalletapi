var walletModel = require('../models/wallet');

exports.getWallet = function (req, res) {

    //obtener parametros
    var userId = req.decoded._doc._id;

    //validar parametros
    if (!userId) {
        return res.status(400).json({
            success: false,
            error: {
                code: 400,
                description: 'MISSING_REQUIRED_FIELDS'
            }
        });
    }

    //consultar base de datos
    walletModel.getByUser(userId, function(err, wallet) {
        if (err) {
            return res.status(err.code ? err.code : 500).json({
                success: false,
                error: err
            });
        }
        //retornar resultado
        return res.status(200).json({
            success: true,
            response: wallet
        });
    });

}

exports.putWallet =  function (req, res) {

    //obtener parametros
    var userId = req.decoded._doc._id;
    var document = req.body.document;
    var cellphone = req.body.cellphone;
    var value = req.body.value;

    //2 VALIDAR PARAMETROS
    if (!userId || !document || !cellphone || !value || value  <= 0) {
        return res.status(400).json({
            success: false,
            error: {
                code: 400,
                description: 'INVALID_FIELDS'
            }
        });
    }

    //GUARDAR BASE DE DATOS
    walletModel.update({
        userId: userId,
        document: document,
        cellphone: cellphone
    }, { balance: value }, function(err, result) {
        if (err) {
            return res.status(err.code ? err.code : 500).json({
                success: false,
                error: err
            });
        }
        return res.status(200).json({
            success: true,
            response: result
        });
    });
    
}
