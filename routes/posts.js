const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const auth = require('../middleware/auth')


router.post('/posts', auth, async (req, res) => {
    try{
        const {title , description} = req.body
        const created_by = req.user._id
        console.log(created_by)
        const newPost = Post({title, description,created_by})
        console.log(newPost)
        await newPost.save()
        const post = await Post.findOne({_id : newPost._id})
        const {createdAt, _id} = post
        res.json({_id, title, description, createdAt})
    }catch(e){
        console.log(e.message)
        res.status(403).json({message : e.message})
    }
})

router.route('/posts/:id')
      .delete(auth, async (req, res) => {
            try{
                const {id} = req.params
                const user = req.user
                await Post.deleteOne({_id : id, created_by : user._id})
                res.json({message : `deleted post`, _id : id})
            }catch(e){
                console.log(e.message)
                res.status(404).json({message : e.message})
            }
        })
      .get(async (req, res) => {
            try{
                const {id} = req.params
                const post = await Post.findOne({_id : id}).populate('comments')
                res.send(post)
            }catch(e){
                console.log(e.message)
                res.status(404).json({message : e.message})
            }
        })

router.get('/all_posts',auth,async (req, res) => {
    try{
        const user = req.user
        const posts = await Post.find({created_by : user._id}, {title : 1, description : 1, createdAt : 1, comments : 1, likes : 1}).populate('likes comments')
        res.send(posts)
    }catch(e){
        console.log(e.message)
        res.status(404).json({message : e.message})
    }
})

module.exports = router