const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

router.post('/authenticate' , async (req, res) => {
    try{
        const {email, password} = req.body
        // if user is found in database , set a JWT
        const user = await User.findOne({email})
        if(user && user.password === password){
            user.password = null
            const token = jwt.sign({user}, process.env.JWT_TOKEN_KEY, {
                expiresIn: "5h"
            })
            return res.send({jwt : token})
        }
        return res.status(400).json({message : 'wrong credentials'})
    }catch(e){
        console.log(e.message)
        res.status(500).json({message : e.message})
    }
})


module.exports = router