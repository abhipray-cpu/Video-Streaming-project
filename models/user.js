const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    user_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    premium: {
        type: Boolean,
        required: true,
    },
    onlyFans: [{
        type: mongoose.Types.ObjectId,
        ref: 'star',
        required: true
    }],
    cart: {
        type: mongoose.Types.ObjectId,
        ref: 'Cart',
    },
    resetToken: String,
    resetTokenExpiration: Date
})

module.exports = mongoose.model('User', userSchema)