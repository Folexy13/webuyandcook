var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String},
    price: { type: String},
    paymentStatus: { type: String, required: true },
    status: { type: String },
    day:{ type: String}
})

module.exports = mongoose.model('Order', schema)