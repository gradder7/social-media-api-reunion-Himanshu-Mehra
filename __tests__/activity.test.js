const {chai, server} = require('./index')
const Post = require('../models/post')
const User = require('../models/user');
const Comment = require('../models/comment')

describe('Activity Routes', () => {
    before(async () => { //Before each test we empty the database
        console.log('clearing post and user database before use, and create a dummy user')
        await Post.deleteMany({})
        await User.deleteMany({})
        await Comment.deleteMany({})
        let user = User({
            email : 'test@email.com',
            password : 'password',
            name : 'test'
        })
        await user.save()
     });
     after(async () => {
        await Post.deleteMany({})
        await User.deleteMany({})
        await Comment.deleteMany({})
        console.log('clearing database')
     })
     describe('Create Post - Like - Comment - Query', () => {
        let userToken = null
        let postId = null
        let comment = null
        let login = {
            email : 'test@email.com',
            password : 'password'
        }
        const post = {
            title : 'title',
            description : 'description'
        }
        const commentPayload = {
            comment : 'this is a test comment'
        }

        it('it should authenticate a user', (done) => {
            chai.request(server)
                .post('/api/authenticate')
                .send(login)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('jwt')
                    userToken = res.body.jwt
                    done();
                });
        });
        it('it should create a post', (done) => {
            chai.request(server)
                .post('/api/posts')
                .send(post)
                .set('authorization', userToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id')
                    res.body._id.should.be.a('string')
                    res.body.should.have.property('title').eql(post.title)
                    res.body.should.have.property('description').eql(post.description)
                    postId = res.body._id
                    done();
                });
            });
        it('it should like the created post', (done) => {
            chai.request(server)
                .post(`/api/like/${postId}`)
                .set('authorization', userToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('likes')
                    res.body.likes.should.be.a('array').to.have.lengthOf(1)
                    done();
                });
            });
        it('it should comment on the created post', (done) => {
            chai.request(server)
                .post(`/api/comment/${postId}`)
                .send(commentPayload)
                .set('authorization', userToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('comment').eql(commentPayload.comment)
                    comment = res.body
                    done();
                });
            });
        it('it should query the created post', (done) => {
            chai.request(server)
                .get(`/api/posts/${postId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id').eql(postId)
                    res.body.should.have.property('title').eql(post.title)
                    res.body.should.have.property('description').eql(post.description)
                    res.body.should.have.property('comments').to.have.lengthOf(1)
                    res.body.should.have.property('likes').to.have.lengthOf(1)
                    res.body.comments.should.be.a('array').eql([comment])
                    done();
                });
            });
     });    

})
