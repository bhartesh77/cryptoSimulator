const express = require('express');
const res = require('express/lib/response');
const path = require('path');
const { nextTick } = require('process');
const port = 8000;

//const db = require('./config/mongoose');
//const Contact = require('./models/contact');

const router = express();

router.set('view engine', 'ejs');
router.set('views', path.join(__dirname,'views'));
router.use(express.urlencoded()); //middleware
router.use(express.static('assets')); //static


router.get('/', function(req, res) {
    res.render('home');
})

router.get('/register', function(req, res) {
    res.render('register');
})

router.get('/user', function(req,res) {
    res.render('user');
})

router.get('/trade', function(req,res) {
    res.render('trade');
})

router.listen(port, function(err) {

    if(err) {
        return;
    }
    console.log('server is up and running on port', port);
})