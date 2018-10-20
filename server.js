const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const { Client } = require('pg')
require('dotenv').config()

const app = express()

const mustache = mustacheExpress()
mustache.cache = null
app.engine('mustache', mustache)
app.set('view engine', 'mustache')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))

app.get('/movies', (req, res) => {
  const client = new Client()
  client.connect().then(() => {
    console.log('connected')
    const sql = 'SELECT * FROM movies'
    return client.query(sql)
  }).then((result) => {
    console.log(result)
    res.render('movie-list', result)
  })
})

app.get('/users', (req, res) => {
  const client = new Client()
  client.connect().then(() => {
    console.log('connected')
    return client.query('SELECT * FROM users')
  }).then(result => {
    console.log(result)
    res.render('user-list')
  }).catch(err => {
    console.log('err', err)
    res.send('something bad happened, biiiiitch')
  })
})

app.get('/movie/add', (req, res) => {
  res.render('movie-form')
})

app.get('/user/add', (req, res) => {
  res.render('user-form')
})

app.post('/movie/add', (req, res) => {
  console.log('post body', req.body)
  const client = new Client()
  client.connect().then(() => {
    console.log('connected')
    const sql = 'INSERT INTO movies (title, director) VALUES ($1, $2)'
    const params = [req.body.title, req.body.director]
    return client.query(sql, params)
  }).then((result) => {
    console.log(result)
    res.redirect('/movies')
  }).catch((err) => {
    console.log('err', err);
    res.redirect('/movies');
  })
})

app.post('/user/add', (req, res) => {
  console.log('post body', req.body)
  const client = new Client()
  client.connect().then(() => {
    const sql = 'INSERT INTO users (user_name, nick_name, password) VALUES ($1, $2, $3)'
    const params = [req.body.user_name, req.body.nick_name, req.body.password]
    return client.query(sql, params)
  }).then((result) => {
    console.log('res', result)
    res.redirect('/users')
  }).catch(err => {
    console.log('err', err)
    res.redirect('/users')
  })
})

app.post('/movie/delete/:id', (req, res) => {
  const client = new Client()
  client.connect().then(() => {
    console.log('connected')
    const sql = 'DELETE FROM movies WHERE id = $1'
    const params = [req.params.id]
    return client.query(sql, params)
  }).then(result => {
    console.log(result)
    res.redirect('/movies')
  }).catch(err => {
    console.log(err)
    res.redirect('/movies')
  })
})

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
})