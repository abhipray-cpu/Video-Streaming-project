const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number
    }]
})
module.exports = mongoose.model('Order', cartSchema)