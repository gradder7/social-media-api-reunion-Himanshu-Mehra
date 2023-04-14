const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const auth = require('../middleware/auth')

router.post('/like/:id',auth, async(req, res) => {
    try{
        const {id} = req.params
        const user = req.user
        const post = await Post.findOne({_id:id})
        post.likes.push(user._id)
        await post.save()
        res.json(post)
    }catch(e){
        console.log(e.message)
        res.status(404).json({message : e.message})
    }
    
})

router.post('/unlike/:id', auth, async (req, res) => {
    try{
        const {id} = req.params
        const user = req.user
        const post = await Post.findOne({_id:id})
        post.likes = post.likes.filter((id) => id.toString() !== user._id.toString())
        await post.save()
        res.send(post)
    }catch(e){
        console.log(e.message)
        res.status(404).json({message : e.message})
    }
})

module.exports = router