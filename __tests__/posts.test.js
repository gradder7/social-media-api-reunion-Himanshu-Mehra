const {chai, server} = require('./index')
const Post = require('../models/post')
const User = require('../models/user');

describe('Post Routes', () => {
    before(async () => { //Before each test we empty the database
        console.log('clearing post and user database before use, and create a dummy user')
        await Post.deleteMany({})
        await User.deleteMany({})
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
        console.log('clearing database')
     })
     describe('Create - Query', () => {
        let userToken = null
        let postId = null
        let login = {
            email : 'test@email.com',
            password : 'password'
        }
        const post = {
            title : 'title',
            description : 'description'
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
        it('it should query the created post', (done) => {
            chai.request(server)
                .get(`/api/posts/${postId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id').eql(postId)
                    res.body._id.should.be.a('string')
                    res.body.should.have.property('title').eql(post.title)
                    res.body.should.have.property('description').eql(post.description)
                    res.body.should.have.property('comments').eql([])
                    res.body.should.have.property('likes').eql([])
                    done();
                });
            });
        it('it should query the all the post created by user', (done) => {
            chai.request(server)
                .get(`/api/all_posts`)
                .set('authorization', userToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('_id').eql(postId)
                    res.body[0].should.have.property('title').eql(post.title)
                    res.body[0].should.have.property('description').eql(post.description)
                    res.body[0].should.have.property('comments').eql([])
                    res.body[0].should.have.property('likes').eql([])
                    done();
                });
            });
        it('it should delete the created post', (done) => {
            chai.request(server)
                .delete(`/api/posts/${postId}`)
                .set('authorization', userToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object').eql({message : `deleted post`, _id : postId});
                    done();
                });
            });
     });    
})
