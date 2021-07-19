var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema([{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: [{ type: String }],
    price: [{type:String}],
    totalPrice: { type: String},
    change: { type: String},
    paymentStatus: { type: String, required: true },
    status: { type: String },
    day:{ type: String},
    quantity:[{ type: String}]
}])



module.exports =mongoose.model('Order', schema)