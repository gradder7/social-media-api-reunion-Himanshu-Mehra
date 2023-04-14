const mongoose = require('mongoose')
const validator = require('validator')
const ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required : [true, 'Username is required'],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'User email required'],
        unique: true,
        lowercase: true,
        validate: {
          validator: validator.isEmail,
          message: 'invalid email',
          isAsync: false
        }
    },
    password : {
        type: String,
        required : [true, 'Username is required']
    },
    followers : {
        type: [{type:ObjectId, ref:'User'}],
        default : []
    },
    following : {
        type: [{type:ObjectId, ref:'User'}],
        default : []
    },
}, {timestamps:true})


module.exports = mongoose.model('User', userSchema)