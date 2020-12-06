var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    document: {
        type: String,
        required: true
    },
    names: {
        type: String,
        required: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/, 'Incorrect format email address.']
    },
    password: {
        type: String
    },
    cellphone: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password' || this.IsNew)) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next();
            })
        })
    } else {
        return next();
    }
});

UserSchema.pre('update', function (next) {
    if (this.getUpdate().$set.password) {
        this.update({}, {
            password: bcrypt.hashSync(this.getUpdate().$set.password, 10)
        });
    }
    next();
});

UserSchema.methods.comparePassword = function (password, next) {
    bcrypt.compare(password, this.password, function (err, isMach) {
        if (err) {
            return next(err);
        }
        next(null, isMach);
    })
}


module.exports = mongoose.model('User', UserSchema);
