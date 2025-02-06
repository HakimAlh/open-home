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
        
        const userHasFavorited = listing.favoritedByUsers.some((user) => user.equals(req.session.user._id))
        
        res.render('listings/show.ejs', {
            title: listing.streetAddress,
            listing,
            userHasFavorited
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
         if(listing.owner.equals(req.params.userId)) {

         
        res.render('listings/edit.ejs', {
            title: `Edit ${listing.streetAddress}`,
            listing
        })
     } else {
        res.send("You don't have permission to do that.")
     }
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

const addFavorite = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.listingId, {
            $push: { favoritedByUsers: req.params.userId}
        })
        console.log(listing)
        res.redirect(`/listings/${listing._id}`)

    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const removeFavorite = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.listingId, {
            $pull: { favoritedByUsers: req.params.userId}
        })
        res.redirect(`/listings/${listing._id}`)
    } catch (error){
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
    addFavorite,
    removeFavorite,
}