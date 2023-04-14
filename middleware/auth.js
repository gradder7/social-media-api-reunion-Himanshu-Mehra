const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try{
        const {authorization} = req.headers
        const payload = jwt.verify(authorization, process.env.JWT_TOKEN_KEY)
        req.user = payload.user
        console.log(req.user)
        next()
    }catch(e){
        console.log(e.message)
        res.status(404).json({message : 'authentication middleware error'})
    }
}

module.exports = auth