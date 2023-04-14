const mongoose = require("mongoose");
const User = require('../models/user');
const {chai, server} = require('./index')

describe('User Routes', () => {
    before((done) => { //Before each test we empty the database
        console.log('clearing user database before use')
        User.deleteMany({}, (err) => { 
           done();           
        });        
     });
     
     after(async () => {
        await User.deleteMany({})
        console.log('clearing database')
     })

    describe('Create - Authenitcate - Query', () => {
        let userId = null
        let userToken = null
        it('it should create a user', (done) => {
            let user = {
                email : 'test@email.com',
                password : 'password',
                name : 'test'
            }
            chai.request(server)
                .post('/api/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('string');
                    userId = res.body
                    done();
                });
            });
        it('it should authenticate a user', (done) => {
            let login = {
                email : 'test@email.com',
                password : 'password'
            }
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
        it('it should return the logged in user', (done) => {
            chai.request(server)
                .get('/api/user')
                .set('authorization', userToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name')
                    res.body.name.should.be.a('string')
                    res.body.should.have.property('followers')
                    res.body.followers.should.be.a('array')
                    res.body.should.have.property('following')
                    res.body.following.should.be.a('array')
                    res.body.should.have.property('_id')
                    res.body._id.should.be.eql(userId)
                    done();
                });
            });          
        }); 
});
