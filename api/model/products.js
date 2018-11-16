const mongoose = require('mongoose')
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    price: Number
})

module.exports = mongoose.model('Product', productSchema)