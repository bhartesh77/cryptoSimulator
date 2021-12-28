const express = require('express');
// const res = require('express/lib/response');
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

// data storage

let walletBalance = 0;

var trades = [
    {
        name: 'btc',
        leverage: 6,
        entryPrice: 293, 
        margin: 986
    }
]

// post routers
router.post('/add-money', function(req,res) {
    walletBalance += parseInt(req.body.money);
    //console.log(walletBalance);
    return res.redirect('back');
})

router.post('/buy-btc', function(req,res) {
    walletBalance -= parseInt(req.body.amount);

    return res.redirect('/user');
})


// get routers
router.get('/', function(req, res) {
    res.render('home');
})

router.get('/register', function(req, res) {
    res.render('register');
})

router.get('/user', function(req,res) {
    res.render('user', {
        walletbalance: walletBalance
    });
})

router.get('/trade', function(req,res) {
    res.render('trade', {
        walletbalance: walletBalance
    });
})

router.listen(port, function(err) {

    if(err) {
        return;
    }
    console.log('server is up and running on port', port);
})