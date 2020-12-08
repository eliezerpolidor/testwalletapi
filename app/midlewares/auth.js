var jwt = require('jsonwebtoken');
var config = require('../../config/main').get(process.env);
var SECRET = config.secret;

exports.authenticate = function(req, res, next) {
  var token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, SECRET, function(err, decoded) {
      if (err) {
        return res.status(401).json({
            success: false,
            error: err
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(400).json({
        success: false,
        error: 'NO_TOKEN_PROVIDED'
    });
  }
}