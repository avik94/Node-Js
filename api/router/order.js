const express = require('express');
const Order = require('../model/order');
const Product = require('../model/product');

const route = express.Router();

route.get('/' ,(req,res)=>{
    Order.find()
    .select('-__v')
    .exec()
    .then(result =>{
        res.status(200).json({
            count:result.length,
            response:result.map(el =>{
                return {
                    quantity : el.quantity,
                    _id : el._id,
                    product : {
                        url : 'http://localhost:1000/product/'+el.product,
                        type: "GET"
                    }
                }
            })
        })
    })
    .catch(err =>{
        res.status(200).json({err:err})
    })
})


route.get('/:productId', (req,res)=>{
    Order.findById(req.params.productId)
    .then(result =>{
        if(result){
            res.status(200).json({
                _id : result._id,
                quantity : result.quantity,
                product : {
                    url : 'http://localhost:1000/product/'+result.product,
                    method : 'GET'
                }

            })
        }else{
            res.status(404).json({
                message : "Product Not Found"
            })
        }
    })
    .catch(err =>{
        res.status(500).json({
            err: err
        })
    })
})

route.post('/' ,(req,res) =>{
    Product.findById(req.body.product)
    .then(result=>{
        if(result){
            const order = new Order({
                product : req.body.product,
                quantity : req.body.quantity
            })
            order.save()
            .then(result => {
                res.status(201).json({
                    message : "Order Created",
                    response: result
                })
            })
            .catch(err =>{
                res.status(500).json({err:err})
            })  
        }else{
            res.json({
                message : "Product Not Found"
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            err:err
        })
    })    
})
route.delete('/:productId', (req,res)=>{
  const id = req.params.productId;
    Order.findById(id)
    .then(result =>{
        if(result){
            Order.deleteMany({_id:id})
            .then(result =>{
                res.status(200).json({
                    message:"Product Deleted Successfully",
                    info:{
                        url:"http://localhost:1000/order",
                        method:"GET"
                    }
                })
            })
            .catch(err => {
                res.status(500).json({
                    err:err
                })
            })
            
        }else{
            res.status(200).json({
                message: "Product Not Found!"
            })
        }
    })
    .catch(err =>{
        res.status(500).json({err:{
            message : "Not Found!" 
        }})
    })
});

route.patch('/:productId' ,(req,res)=>{
    const id = req.params.productId;
    const newObj = {}
    for (const ops of req.body){
        newObj[ops.propName] = ops.value
    }
    if(newObj.quantity){
        Order.updateMany({_id:id},{$set: newObj})
        .then(result => {     
            res.status(200).json({
                msg : "Order Updated",
                message : result 
            })
        })
        .catch(err => {
            res.status(500).json({
                err:err
            })
        })
    }else{
        Product.findById(newObj.product)
        .then(result=>{
            if(result){
                Order.updateMany({_id:id},{$set: newObj})
                .then(result => {     
                    res.status(200).json({
                        msg : "Order Updated",
                        message : result 
                    })
                })
                .catch(err => {
                    req.status(500).json({
                        err:err
                    })
                }) 
            }else{
                res.status(404).json({
                    message: "Product Not Found"
                })
            }
        }).catch(err => {
            res.status.json({
                err:err 
            })
        })

    }   
    
})




module.exports = route;
