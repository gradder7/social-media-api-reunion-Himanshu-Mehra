const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const commentSchema = new mongoose.Schema({
    comment : {
        type: String,
    },
    created_by : {
        type : ObjectId,
        ref : 'User',
        required : [true, 'created_by is required']
    },
    post_id : {
        type : ObjectId,
        ref : 'Post',
        required : [true, 'post_id is required']
    },
}, {timestamps:true})


module.exports = mongoose.model('Comment', commentSchema)