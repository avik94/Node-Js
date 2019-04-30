const express = require('express');
const app = express();
const mongoose = require('mongoose');

const productRoute = require('./api/router/product')
const orderRoute = require('./api/router/order')

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://avik:avik@1994@node-api-u1d0z.mongodb.net/test?retryWrites=true', 
{
    useNewUrlParser: true
});


app.use('/product', productRoute);
app.use('/order' , orderRoute);

app.use((req,res,next) => {
    const err = new Error("Not Found!")
    res.status(404).json({
        err:err.message
    });
    next(err);
})
app.use((err,req,res,next)=>{
    res.json({
        errorMessage: err
    })
});



module.exports = app;