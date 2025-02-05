const bcrypt = require('bcrypt')
const User = require('../models/user')

const signUp = (req, res) => {
    res.render('auth/sign-up.ejs', 
        {title: 'Sign up', msg: ''} )
}

const addUser = async (req, res) => {
    console.log('request body: ', req.body)
    const userInDatabase = await User.findOne({ username: req.body.username})
    if (userInDatabase) {
        return res.render('auth/sign-up.ejs',{
            title: 'Sign up', 
            msg: 'Username already taken.'
        })
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.render('auth/sign-up.ejs', {
            title: 'Sign up',
            msg: 'Password and Confirm Password must match.'
        })
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

    const user = await User.create(req.body)
    
    req.session.user = user
    
    req.session.save(() => {
        res.redirect('/')
    })
    
}

const signInForm = (req, res) => {
    res.render('auth/sign-in.ejs', {
        title: 'Sign in',
        msg: ''
    })
}

const signIn = async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
        return res.render('auth/sign-in.ejs', {
            title: 'Sign in',
            msg: 'Invalid credentials. Please try again.'
        })
    }
    // CHECKING IF PASSWORD IS CORRECT
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    )
    if (!validPassword) {
        return res.render('auth/sign-in.ejs', {
            title: 'Sign in',
            msg: 'Invalid credentials. Please try again.'
        })
    }

    req.session.user = userInDatabase

    req.session.save(() => {
        res.redirect('/')
    })


}

const signOut = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
    
}

module.exports = {
    signUp,
    addUser,
    signInForm,
    signIn,
    signOut,
}