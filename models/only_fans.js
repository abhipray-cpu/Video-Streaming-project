const mongoose = require('mongoose')
const Schema = mongoose.Schema
const onlyFansSchema = new Schema({

    users: {
        type: Array,
        type: String,
        required: true
    },
    star: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('OnlyFans', onlyFansSchema)