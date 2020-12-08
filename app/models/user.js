var User = require('../schemas/user');

function isEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

exports.save = function(attrs, next) {
    if (!attrs) {
        return next({
            name: "MISSING_REQUIRED_FIELDS",
            code: 400
        })
    }
    const email = attrs.email.toLowerCase();
    if (!isEmail(email)) {
        return next({
            name: "INVALID_EMAIL",
            code: 400
        });
    }
    User.findOne({
        email
    }, function(err, user) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err,
                code: 400
            });
        }
        if (user) {
            return next({
                name: "EMAIL_ALREADY_EXIST",
                code: 400
            });
        }
        if (attrs.password.length < 4) {
            return next({
                name: "PASSWORD_TOO_SHORT",
                code: 400
            });
        }

        var user = new User(attrs);

        user.save(function(err, user) {
            if (err) {
                return next({
                    name: "INTERNAL_ERROR",
                    extra: err,
                    code: 500
                });
            }
            return next(null, user);
        });
    });

}

exports.signin = function(attrs, next) {
    if (!attrs.email || !attrs.password) {
        return next({
            name: "MISSING_REQUIRED_FIELDS",
            code: 400
        });
    }
    User.findOne({
        email : attrs.email.trim().toLowerCase()
    }, function(err, user) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err,
                code: 400
            });
        }
        if (!user) {
            return next({
                name: "BAD_CREDENTIALS",
                code: 400
            });
        }

        user.comparePassword(attrs.password, function(err, isMach) {
            if (err) {
                return next({
                    name: "INTERNAL_ERROR",
                    extra: err,
                    code: 500
                });
            }
            if (!isMach) {
                return next({
                    name: "BAD_CREDENTIALS",
                    code: 400
                });
            }
            return next(null, user);
        });
    });
}
