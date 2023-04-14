const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const postSchema = new mongoose.Schema({
    title : {
        type: String,
    },
    description : {
        type: String,
    },
    created_by : {
        type : ObjectId,
        ref : 'User',
        required : [true, 'created_by is required']
    },
    likes : {
        type : [{type : ObjectId, ref : 'User'}],
        default : []
    }, 
    comments : {
        type : [{type : ObjectId, ref : 'Comment'}],
        default : []
    }
}, {timestamps:true})


module.exports = mongoose.model('Post', postSchema)