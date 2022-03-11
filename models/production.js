const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductionSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true,
    },
    URL: {
        type: String,
        required: true,
        unique: true,
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
    }
})

module.exports = mongoose.model('Production', ProductionSchema)