const express = require('express');
// const res = require('express/lib/response');
const path = require('path');
const { nextTick } = require('process');
const WebSocket = require('ws');
const port = 8000;

//const db = require('./config/mongoose');
//const Contact = require('./models/contact');

const router = express();

router.set('view engine', 'ejs');
router.set('views', path.join(__dirname,'views'));
router.use(express.urlencoded()); //middleware
router.use(express.static('assets')); //static

// data storage

let walletBalance = 0, btcPrice, ethPrice;

var trades = [];

// webSockets
// btc
let btc = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
btc.onmessage = (event) => {
    let btcObject = JSON.parse(event.data);
    btcPrice = parseFloat(btcObject.p).toFixed(2);
}


// post routers
router.post('/add-money', function(req,res) {
    walletBalance += parseInt(req.body.money);
    //console.log(walletBalance);
    return res.redirect('back');
})

router.post('/buy-btc', function(req,res) {
    walletBalance -= parseInt(req.body.amount);

    trades.push({
        name: 'btc',
        leverage: parseInt(req.body.leverage),
        entryPrice: 897,
        margin: parseInt(req.body.amount) * parseInt(req.body.leverage),
        entryPrice: btcPrice
    })
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
        walletbalance: walletBalance,
        trades: trades
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