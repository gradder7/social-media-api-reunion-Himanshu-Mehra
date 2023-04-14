const express = require('express')
const router = express.Router()
const Comment = require('../models/comment')
const Post = require('../models/post')
const auth = require('../middleware/auth')

router.post('/comment/:id', auth, async (req, res) => {
    try{
        const {id} = req.params
        const {comment} = req.body
        const user = req.user
        const newComment = Comment({comment ,  created_by : user._id, post_id : id})
        await newComment.save()
        const post = await Post.findOne({id})
        post.comments.push(newComment._id)
        await post.save()
        res.send(newComment)
    }catch(e){
        console.log(e.message)
        res.status(400).json({message : e.message})
    }
})

module.exports = router