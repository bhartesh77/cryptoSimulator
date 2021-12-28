let btc = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
let btcPriceElement = document.getElementById('btc-price');

let btcpointer = -1, ethpointer = -1;

btc.onmessage = (event) => {
    let btcObject = JSON.parse(event.data);
    let price = parseFloat(btcObject.p).toFixed(2);

    
        btcPriceElement.textContent = price;
        if(price>btcpointer) {
            btcPriceElement.style.color = '#2ecc71';
        }
        else {
            btcPriceElement.style.color = '#e74c3c';
        }
    btcpointer = price;
}
        
let eth = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trade');
let ethPriceElement = document.getElementById('eth-price');
eth.onmessage = (event) => {
    let ethObject = JSON.parse(event.data);
    let price = parseFloat(ethObject.p).toFixed(2);

    
        ethPriceElement.textContent = price;
        if(price>ethpointer) {
            ethPriceElement.style.color = '#2ecc71';
        }
        else {
            ethPriceElement.style.color = '#e74c3c';
        }
    ethpointer = price;
}