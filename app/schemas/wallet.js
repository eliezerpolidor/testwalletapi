var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WalletSchema = new Schema({
    balance: {
        type: Number,
        default: 0,
    },
    userId: Schema.Types.ObjectId
});


module.exports = mongoose.model('Wallet', WalletSchema);
