const express = require('express')
const User = require('../models/user')
const router = express.Router()
const auth = require('../middleware/auth')


router.post('/user', async (req, res) => {
    try{
        const {name, email, password} = req.body
        if(!name || !email || !password ){
            return res.status(400).json({message : 'Please fill all feilds'})
        }
        const oldUser = await User.findOne({email})
        if(oldUser){
            return res.status(409).send("User Already Exist. Please Login");
        }
        const newUser = User({name, email, password})
        await newUser.save()
        res.send(newUser._id)
    }catch(e){
        console.log(e.message)
        res.status(400).json({message : e.message})
    }
})

router.get('/user', auth, async (req, res) => {
    try{
        const user = req.user
        const _id = user._id
        const userInfo = await User.findOne({_id}, {name : 1, followers : 1, following:1})
        userInfo.followers = userInfo.followers.length
        userInfo.following = userInfo.following.length
        const {name, followers, following}  = userInfo
        res.json({name, followers, following, _id });
    }catch(e){
        console.log(e.message)
        res.status(404).json({message : e.message})
    }
})

module.exports = router