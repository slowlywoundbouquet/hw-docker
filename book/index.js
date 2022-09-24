
const express = require('express');
const err = require('./middleware/404')
const usersRouter = require('./routes/users')
const booksRouter = require('./routes/books')
const mainRouter = require('./routes/index')


const app = express();

app.use(express.urlencoded({extended: true}));


app.set("view engine", "ejs");

console.log("Привет");

app.use('/', mainRouter)
app.use('/api/user', usersRouter)
app.use('/api/books', booksRouter)
app.use(err)


const PORT = process.env.PORT || 3000
app.listen(PORT)