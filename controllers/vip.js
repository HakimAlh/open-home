const welcome = (req, res) => {
        res.send(`Welcome to the party ${req.session.user.username}`)
    }
  


module.exports = {
    welcome,
}