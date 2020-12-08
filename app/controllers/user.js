var userModel = require('../models/user');
var walletModel = require('../models/wallet');

var jwt = require('jsonwebtoken');
var config = require('../../config/main').get(process.env.NODE_ENV);
const SECRET = config.secret;


function generateToken(doc, expiresIn) {
    return jwt.sign(doc, SECRET, {
        expiresIn: expiresIn
    });
}

exports.createUser = function (req, res) {

    //1 OBTENER PARAMETROS
    var document = req.body.document;
    var names = req.body.names;
    var email = req.body.email;
    var password = req.body.password;
    var cellphone = req.body.cellphone;

    //2 VALIDAR PARAMETROS
    if (!document || !names || !email || !password || !cellphone) {
        return res.status(400).json({
            success: false,
            error: {
                code: 400,
                description: 'MISSING_REQUIRED_FIELDS'
            }
        });
    }

    //GUARDAR BASE DE DATOS
    userModel.save({
        document: document,
        names: names,
        email: email,
        password: password,
        cellphone: cellphone
    }, function(err, user) {
        if (err) {
            return res.status(err.code ? err.code : 500).json({
                success: false,
                error: err
            });
        }
        walletModel.save({
            balance : 0.0,
            userId: user._id
        }, function(err, wallet) {
            if (err) {
                return res.status(err.code ? err.code : 500).json({
                    success: false,
                    error: err
                });
            }
            user.wallet = wallet;
            //RETORNAR RESULTADO
            return res.status(201).json({
                success: true,
                response: user
            });
        });
    });

}

exports.signin = function (req, res) {

    //1 OBTENER PARAMETROS
    var email = req.body.email;
    var password = req.body.password;

     //2 VALIDAR PARAMETROS
    if (!req.body.email || !req.body.password) {
        return res.status(err.code ? err.code : 500).json({
            success: false,
            error: err
        });
    }

    //CONSULTAR BASE DE DATOS
    userModel.signin({
      email : email,
      password : password
    }, function(err, user) {
        if (err) {
            return res.status(err.code ? err.code : 500).json({
                success: false,
                error: err
            });
        }

        //RETORNAR RESULTADO
        return res.status(200).json({
            success: true,
            response: {
                token: generateToken({
                    _doc: {
                        _id: user._id
                    }
                },
                    "365d"),
                user: user
            }
        });
    });

}