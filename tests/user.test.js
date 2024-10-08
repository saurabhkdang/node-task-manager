const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, userOneId, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Saurabh Dang',
        email: 'saurabh.dang@technoscore.net',
        password: 'Test1234'
    }).expect(201)
    
    // Assert that the database was changed correctly
    const user = await User.findById(response.body.result._id)
    expect(user).not.toBeNull()
    
    // Assertions about the response
    expect(response.body).toMatchObject({
        result: {
            name: 'Saurabh Dang',
            email: 'saurabh.dang@technoscore.net'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('Test1234')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)    
    expect(user).not.toBeNull()
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'test'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete the user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    // const user = await User.findById(response.body._id)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    const response = await request(app)
                    .patch('/users/me')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                    .send({
                        name: 'Ravi Dang'
                    })
                    .expect(200)
    const user = await User.findById(userOneId)    
    expect(user.name).toEqual("Ravi Dang")
    // expect(response.body.name).not.toBe(userOne.name)
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'test'
        })
        .expect(400)
})

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated