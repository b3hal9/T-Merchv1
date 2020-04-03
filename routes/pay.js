const router = require('express').Router();
const paypal = require('paypal-rest-sdk');

router.post('/pay',(req,res)=>{
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method" : "paypal"
        },
        "redirect_urls" :{
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel",
        },
        "transactions": [{
            "item_list": {
                "items" : [{
                    "name" : "T-shirt",
                    "sku" : "001",
                    "price": "30",
                    "currency" : "USD",
                    "quantity" : 1,
                }]
            },
            "amount": {
                "currency" : "USD",
                "total" : "30.00",
            },
            "description": "Awosome T-shirt for Tech lovers."
        }]
    };

    paypal.payment.create(create_payment_json, function(err,payment){
        if(err){
            throw err;
        } else {
            for(let i=0;i<payment.links.length; i++){
                if(payment.links[i].rel === 'approval_url'){
                    res.redirect(payment.links[i].href);
                }
            }
        }
    })
});


router.get('/success',(req,res)=>{
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;


    const execute_payment_json = {
        "payer_id": payerId,
        "transaction":[{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };
    paypal.payment.execute(paymentId,execute_payment_json, function(err,payment){
        if(err){
            console.log(err.response);
            throw err;
        } else{
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.send('Success');

        }
    })
});

router.get('/cancel', (req,res)=>res.send('Payment Cancelled.'));

module.exports = router;