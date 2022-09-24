const express = require('express')
const router = express.Router();
const fileMulter = require('../middleware/file')
const {v4: uuid} = require('uuid');
const path = require('path');
const axios = require('axios');

class Books {
    constructor(id=uuid(), title="", description="", authors="", favorite="", fileCover="", fileName="", fileBook="") {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
    }
}

const store = {
    books: [],
};

router.get('/', (req, res) => {
    const {books} = store
    res.render("books/index", {
        title: "Все книги",
        books: books,
    });

})

router.get('/view/:id', async  (req, res) => {
    const {books} = store
    const {id} = req.params
    const index = books.findIndex(el => el.id === id)

    if (index === -1) {
        res.redirect('/404');
    } else {
axios.post(`http://counter:1234/counter/add`, {
            id: `${id}`,
          },
          {
            headers: {
                'Content-Type': 'application/json',
            }
        })
          .catch(function (error) {
            console.log(error);
          });
        const {data} = await axios.get(`http://counter:1234/counter/${id}/incr`)
            .catch((error) => {
                console.log(error);
            })
            
        await res.render("books/view", {
            title: "Книги | просмотр",
            books: books[index],
            dataview: data.counter
        });
    }
})


router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Книги | добавление",
        books: {},
    });
});

router.post('/create', fileMulter.single('fileBook'), (req, res) => {
    const {books} = store
    let {id, title, description, authors, favorite, fileCover, fileName} = req.body
    if (req.file) {
        let fileBook
        fileBook = req.file.path
        const newBooks = new Books(id, title, description, authors, favorite, fileCover, fileName, fileBook)
        books.push(newBooks)
    } else {
        fileBook = null
        const newBooks = new Books(id, title, description, authors, favorite, fileCover, fileName, fileBook)
        books.push(newBooks)
    }
    res.redirect(`/api/books`)
})

router.get('/update/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const index = books.findIndex(el => el.id === id);

    if (index === -1) {
        res.redirect('/404');
    }
    res.render("books/update", {
        title: "Книги | обновление",
        books: books[index],
    });
});

router.post('/update/:id', fileMulter.single('fileBook'), (req, res) => {
    const {books} = store
    const {title, description, authors, favorite, fileCover, fileName} = req.body
    const {id} = req.params
    const index = books.findIndex(el => el.id === id);
    let fileBook
    if (req.file) {
        fileBook = req.file.path
        books[index] = {
            ...books[index],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook
        }
    } else {
        fileBook = null
        books[index] = {
            ...books[index],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook
        }
    }
    if (index === -1) {
        res.redirect('/404');
    }
    res.redirect(`/api/books/view/${id}`);
})


router.post('/delete/:id', (req, res) => {
    const {books} = store
    const {id} = req.params
    const index = books.findIndex(el => el.id === id)

    if (index === -1) {
        res.redirect('/404');
    }
    books.splice(index, 1);
    res.redirect(`/api/books/`);
})

router.get('/:id/download', (req, res) => {
    const {books} = store
    const {id} = req.params
    const index = books.findIndex(el => el.id === id)
    if (index !== -1) {
        let bookpath = books[index].fileBook
        if (bookpath) {
            let fname = path.basename(books[index].fileBook)
            res.download(`${bookpath}`, `${fname}`, err => {
                if (err) {
                    res.status(404).json();
                }
            });
        } else {
            res.redirect('/404');
        }
    }
})

module.exports = router