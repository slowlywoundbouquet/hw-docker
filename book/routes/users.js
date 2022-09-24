const express = require('express')
const router = express.Router()

class Users {
    constructor(id=uuid(), mail="test@mail.ru") {
        this.id = id
        this.mail = mail
    }
}

const userStore = {
    users: [],
}

router.post('/login', (req, res) => {
    const {users} = userStore
    const {id, mail} = req.body

    const newUsers = new Users(id, mail)
    users.push(newUsers)
    res.status(201)
    res.json(newUsers)
})

router.get('/', (req, res) => {
    const {users} = userStore
    res.json(users)
})

module.exports = router