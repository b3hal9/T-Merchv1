const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
const pay = require('./routes/pay');
const path = require('path');
const keys = require('./config/keys');

//configure Paypal
paypal.configure({
    'mode': 'sandbox',    //sandbox || live
    'client_id': keys.clientID,
    'client_secret': keys.SecretKey,
})

const app = express();

app.use(express.static(path.join(__dirname,'/public')))
app.set('view engine', 'ejs');


app.get('/', (req,res)=> res.render('index'));

app.use(pay);
app.listen(3000, ()=>console.log("Server is running!"));

