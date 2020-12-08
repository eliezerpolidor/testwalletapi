var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    tokenId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0,
    },
    amount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'complete', 'cancelled'],
        default: 'pending'
    },
    userId: Schema.Types.ObjectId
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('Payment', PaymentSchema);
