const express = require('express')
const router = express.Router()

const authenticateRoute = require('./authenticate')
const followRoute = require('./follow')
const userRoute = require('./user')
const postsRoute = require('./posts')
const likeRoute = require('./like')
const commentsRoute = require('./comment')

router.use('/', [authenticateRoute, likeRoute, commentsRoute, followRoute, userRoute, postsRoute])

module.exports = router