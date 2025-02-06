const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
    streetAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    size: {
        type: Number,
        require: true,
        min: 0,
    },
    imgUrl: {
        type: String,
        default: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    },
    favoritedByUsers: [
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
     }

    ]

}, {timestamps: true})

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing