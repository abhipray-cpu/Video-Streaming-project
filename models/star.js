const mongoose = require('mongoose')
const Schema = mongoose.Schema
const starSchema = new Schema({
    price: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],

    },
    image: {
        type: String,
        required: true,
        //never pass unique with text type remember it next time
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        type: mongoose.Types.ObjectId
    },
    video: {
        type: Array,
        type: mongoose.Types.ObjectId
    },
    products: {
        type: Array,
        type: mongoose.Types.ObjectId
    },
    view: {
        type: Number,
        required: true
    }

})

module.exports = mongoose.model('Star', starSchema)