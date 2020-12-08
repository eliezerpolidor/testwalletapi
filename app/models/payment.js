var Payment = require('../schemas/payment');
var Wallet = require('../schemas/wallet');

exports.save = function(attrs, next) {
    if (!attrs) {
        return next({
            name: "MISSING_REQUIRED_FIELDS",
            code: 400
        })
    }
    attrs.tokenId = Math.random().toString().substr(2,6);
    var payment = new Payment(attrs);
    payment.save(function(err, payment) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err,
                code: 500
            });
        }
        return next(null, payment);
    });

}

exports.confirmPayment = function(attrs, next) {
    if (!attrs) {
        return next({
            name: "MISSING_REQUIRED_FIELDS",
            code: 400
        })
    }

    Payment.findOne({
        userId : attrs.userId,
        tokenId: attrs.tokenId,
        status: "pending"
    }, function(err, payment) {
        if (err) {
            return next({
                name: "INVALID_PAYMENT_EXIST",
                extra: err
            });
        } else if (!payment) {
            return next({
                name: "INVALID_PAYMENT",
                code: 400
            });
        }

        Wallet.findOne({
            userId : attrs.userId
        }, function(err, wallet) {
            if (err) {
                return next({
                    name: "INTERNAL_ERROR",
                    extra: err
                });
            } else if (!wallet) {
                return next({
                    name: "WALLET_NOT_EXIST",
                    extra: err,
                    code: 400
                });
            } 

            if (parseFloat(payment.amount) > wallet.balance) {
                return next({
                    name: "NOT_BALANCE_AVAILABLE",
                    extra: err,
                    code: 400
                });
            }

            wallet.balance -= parseFloat(payment.amount);
            Wallet.update({
                userId: attrs.userId
            }, {balance: wallet.balance}, function(err, wallet) {
                if (err) {
                    return next({
                        name: "INTERNAL_ERROR",
                        extra: err
                    });
                }
                payment.status = "complete";
                Payment.update({
                    userId : attrs.userId,
                    tokenId: attrs.tokenId,
                    status: "pending"
                }, {status: "complete"}, function(err, paymentUpdate) {
                    if (err) {
                        return next({
                            name: "INTERNAL_ERROR",
                            extra: err
                        });
                    } 
                    return next(null, payment);
                })

            })
           

        });



    });


}
