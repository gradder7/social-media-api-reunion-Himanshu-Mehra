const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/follow/:id', auth, async (req, res) => {
    try{
        const {id} = req.params
        const user = req.user
        const followingUserObject = await User.findOne({_id : id})
        const followerUserObject = await User.findOne({_id : user._id})    
        
        // check if follow already exists and return an error

        followingUserObject.followers.push(user._id)
        followerUserObject.following.push(_id)
        
        await followingUserObject.save()
        await followerUserObject.save()
    
        res.send(`User ${user._id} now follows user ${id}`)
    }catch(e){
        console.log(e.message)
        res.status(404).json({message : e.message})
    }
})

router.post('/unfollow/:id', auth, async (req, res) => {
    try{
        const {id} = req.params
        const user = req.user
        const unfollowingUserObject = await User.findOne({_id : id})
        const unfollowerUserObject = await User.findOne({_id : user._id})    
        
        unfollowingUserObject.followers = unfollowingUserObject.followers.filter((id) => id.toString() !== user._id.toString())
        unfollowingUserObject.following = unfollowingUserObject.following.filter((id) => id.toString() !== _id.toString())

        await unfollowingUserObject.save()
        await unfollowerUserObject.save()

        res.send(`User ${user._id} now unfollows user ${id}`)
    }catch(e){
        console.log(e.message)
        res.status(404).json({message : e.message})
    }
})

module.exports = router