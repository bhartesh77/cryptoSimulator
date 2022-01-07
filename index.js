const express = require('express');
// const res = require('express/lib/response');
const path = require('path');
const axios = require('axios');
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

let walletBalance = 0, roe_btc = -1, entryPrice_btc = -1, margin_btc = -1, pnl_btc = -1, leverage_btc = -1;
let roe_eth = -1, entryPrice_eth = -1, margin_eth = -1, pnl_eth = -1, leverage_eth = -1;
var trades = [];
var btc = -1, eth = -1;

// geckoAPI
const btctick = async() => { // BTC
    const results = await Promise.all([
        axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
        axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')
    ]);
    const marketPrice = results[0].data.bitcoin.usd / results[1].data.tether.usd;
    btc = parseFloat(marketPrice);
}
const ethtick = async() => { // ETH
    const results = await Promise.all([
        axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'),
        axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')
    ]);
    const marketPrice = results[0].data.ethereum.usd / results[1].data.tether.usd;
    eth = parseFloat(marketPrice);
}

setInterval(btctick, 5000);
setInterval(ethtick, 5000);

const updateMarketPrice = () => {
    for(let i of trades) {
        if(i.name === 'btc') {
            var percent = ((btc-entryPrice_btc)/entryPrice_btc)*100;
            pnl_btc = parseFloat((percent/100)*margin_btc*leverage_btc); 
            roe_btc = parseFloat((pnl_btc/margin_btc)*100);

            i.marketPrice = parseFloat(btc).toFixed(2);
            i.roe = parseFloat(roe_btc).toFixed(2);
            i.pnl = parseFloat(pnl_btc).toFixed(2);

            if(btc !== entryPrice_btc) console.log(btc);
        }
        if(i.name === 'eth') {
            var percent = ((eth-entryPrice_eth)/entryPrice_eth)*100;
            pnl_eth = parseFloat((percent/100)*margin_eth*leverage_eth); 
            roe_eth = parseFloat((pnl_eth/margin_eth)*100);

            i.marketPrice = parseFloat(eth).toFixed(2);
            i.roe = parseFloat(roe_eth).toFixed(2);
            i.pnl = parseFloat(pnl_eth).toFixed(2);

            if(eth !== entryPrice_eth) console.log(eth, pnl_eth);
        }
    }
}

setInterval(updateMarketPrice,1000);

// POST Routers
router.post('/add-money', function(req,res) {
    if(req.body.money > 0) walletBalance += parseFloat(req.body.money);
    return res.redirect('back');
})

// buy BTC
router.post('/buy-btc', function(req,res) {
    walletBalance -= parseFloat(req.body.amount);


    entryPrice_btc = parseFloat(btc);
    margin_btc = parseFloat(req.body.amount);
    leverage_btc = parseFloat(req.body.leverage);

    roe_btc = parseFloat(((btc-entryPrice_btc)/entryPrice_btc)*100).toFixed(2);
    pnl_btc = parseFloat(((roe_btc+100)/100)*margin_btc).toFixed(2);

    trades.push({
        name: 'btc',
        leverage: parseInt(leverage_btc),
        entryPrice: parseFloat(btc).toFixed(2),
        marketPrice: parseFloat(btc).toFixed(2),
        margin: parseFloat(margin_btc),
        liquidationPrice: parseFloat(((100-100/parseInt(leverage_btc))/100)*btc).toFixed(2),
        roe: parseFloat(roe_btc),
        pnl: parseFloat(pnl_btc)
    })
    
    return res.redirect('/user');
})

//buy ETH
router.post('/buy-eth', function(req,res) {
    walletBalance -= parseFloat(req.body.amount);


    entryPrice_eth = parseFloat(eth);
    margin_eth = parseFloat(req.body.amount);
    leverage_eth = parseFloat(req.body.leverage);

    roe_eth = parseFloat(((eth-entryPrice_eth)/entryPrice_eth)*100).toFixed(2);
    pnl_eth = parseFloat(((roe_eth+100)/100)*margin_eth).toFixed(2);

    trades.push({
        name: 'eth',
        leverage: parseInt(leverage_eth),
        entryPrice: parseFloat(eth).toFixed(2),
        marketPrice: parseFloat(eth).toFixed(2),
        margin: parseInt(margin_eth),
        liquidationPrice: parseFloat(((100-100/parseInt(leverage_eth))/100)*eth).toFixed(2),
        roe: parseFloat(roe_eth),
        pnl: parseFloat(pnl_eth)
    })
    
    return res.redirect('/user');
})


// GET Routers
router.get('/', function(req, res) {
    res.render('home');
})

router.get('/register', function(req, res) {
    res.render('register');
})

router.get('/user', function(req,res) {
    res.render('user', {
        walletbalance: parseFloat(walletBalance).toFixed(2),
        trades: trades
    });
})

router.get('/trade', function(req,res) {
    res.render('trade', {
        walletbalance: parseFloat(walletBalance).toFixed(2)
    });
})

//SELL Btc
router.get('/sell-btc', (req,res) => {

    for(var i=0; i<trades.length; i++) {
        if(trades[i].name === 'btc') {
            margin_btc += pnl_btc;
            walletBalance += parseFloat(margin_btc);
            trades.splice(i,1);
        }
    }
    res.redirect('back');
})

//SELL Eth
router.get('/sell-eth', (req,res) => {

    for(var i=0; i<trades.length; i++) {
        if(trades[i].name === 'eth') {
            margin_eth += pnl_eth;
            walletBalance += parseFloat(margin_eth);
            trades.splice(i,1);
        }
    }
    res.redirect('back');
})


router.listen(port, function(err) {

    if(err) {
        return;
    }
    console.log('server is up and running on port', port);
})