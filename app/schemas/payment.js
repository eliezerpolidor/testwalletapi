var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    TokenId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0,
    },
    userId: Schema.Types.ObjectId
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('Payment', PaymentSchema);
