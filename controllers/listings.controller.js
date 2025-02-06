const Listing = require('../models/listing')

const index = async (req, res) => {
    try {
    const listings = await Listing.find().populate('owner')
    console.log(listings)

    res.render('listings/index.ejs', {
        title: 'Listings',
        listings: listings,
    })
    } catch (error) {
    console.log(error)
    res.redirect('/')
    }
   
}

const list = async (req, res) => {
    try {
    res.render('listings/new.ejs', {
        title: 'Add List'
    })
} catch (error) {
    console.log(error)
    res.redirect('/')
    }
}

const listingAdd = async (req, res) => {
    try {
        req.body.owner = req.session.user._id
        console.log(req.body)
        await Listing.create(req.body)
        res.redirect('/listings')
    } catch (error) {
    res.redirect('/listings')
    }
}

const show = async (req, res) => {
    try {
        console.log('show: ', req.params.listingId)
        const listing = await Listing.findById(req.params.listingId).populate('owner')
        console.log(listing)
        res.render('listings/show.ejs', {
            title: listing.streetAddress,
            listing
        })

    } catch (error) {
        console.log(error)
        res.redirect('/')
    }

}

const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId)
        
        if (listing.owner.equals(req.params.userId)) {
            await listing.deleteOne()
            res.redirect('/listings')
        } else {
            res.send("You don't have permission to do that.")
        }

    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}
const edit = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId).populate('owner')
        console.log(listing)
        res.render('listings/edit.ejs', {
            title: `Edit ${listing.streetAddress}`,
            listing
        })
    } catch {
        console.log(error)
        res.redirect('/')
    }
}

const update = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(
        req.params.listingId,
        req.body,
        { new: true}
        )
        res.redirect(`/listings/${listing._id}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}
module.exports = {
    index,
    list,
    listingAdd,
    show,
    deleteListing,
    edit,
    update,
}