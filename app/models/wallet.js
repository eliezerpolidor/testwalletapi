var mongoose = require('mongoose');
var Wallet = require('../schemas/wallet');
var User = require('../schemas/user');

exports.save = function(attrs, next) {
    if (!attrs) {
        return next({
            name: "MISSING_REQUIRED_FIELDS",
            code: 400
        })
    }
    var wallet = new Wallet(attrs);

    wallet.save(function(err, wallet) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err,
                code: 500
            });
        }
        return next(null, wallet);
    });
}


exports.getByUser = function(userId, next) {

    var match = {
        userId: userId
    };

    Wallet.findOne(match, function(err, wallet) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (wallet) {
            return next(null, {
                wallet: wallet
            });
        } else {
            return next({
                name: "USER_NOT_EXIST"
            });
        }
    });

}

exports.update = function(match, set, next) {
    match.userId = mongoose.Types.ObjectId(match.userId);

    User.findOne({
        _id : mongoose.Types.ObjectId(match.userId),
        document : match.document,
        cellphone: match.cellphone
    }, function(err, user) {
        if (err) {
            return next({
                name: "USER_NOT_EXIST",
                extra: err
            });
        }
        else if (!user) {
            return next({
                name: "USER_NOT_EXIST",
                code: 400
            });
        }

        Wallet.findOne({
            userId : match.userId
        }, function(err, wallet) {
            if (err) {
                return next({
                    name: "INTERNAL_ERROR",
                    extra: err
                });
            } else if (!wallet) {
                return next({
                    name: "WALLET_NOT_EXIST",
                    code: 400
                });
            }

            wallet.balance += parseFloat(set.balance);

            Wallet.update({
                userId: match.userId
            }, {balance: wallet.balance}, function(err, data) {
                if (err) {
                    return next({
                        name: "INTERNAL_ERROR",
                        extra: err
                    });
                } else {
                    return next(null, wallet);
                }
            })
        });
    });
}

