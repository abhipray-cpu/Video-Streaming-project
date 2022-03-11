const mongoose = require('mongoose')
const Schema = mongoose.Schema
const videoSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: Number,
        required: true,
    },
    quality: {
        type: String,
        enum: ['4K', '1080p', '720p', '360p', '240p', '144p'],

    },
    tags: {
        type: Array,
        allowNull: false,
    }
})

module.exports = mongoose.model('Video', videoSchema)