const express = require('express');
const mongoose = require('mongoose');
const Product = require('../model/product');

const route = express.Router();

route.get('/', (req,res)=>{
    Product.find()
    .select('_id name price')
    .exec()
    .then(result => {
        res.status(200).json({
            count : result.length,
            product: result.map(el=>{
                return {
                    _id :el.id,
                    name:el.name,
                    price:el.price,
                    info:{
                        method:"GET",
                        url : "http://localhost:1000/product/"+el.id
                    }
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            err:err
        })
    })
})
route.get('/:productId' ,(req,res)=>{
    const id = req.params.productId;
    Product.findById(id)
    .select('_id name price')
    .then(result =>{
        if(result){
            res.status(200).json(result)
        }else{
            res.status(404).json({
                message:"No product Found!"
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message:"No Path Found"
        })
    })
});



route.post('/',(req,res)=>{
    const product = new Product({
        // _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    })    
    product.save()
    .then(result => {
        res.json({
            message:"Created",
            info:{
                method :"GET",
                url: "http://localhost:1000/product/"+product._id

            }
        })
    })
    .catch(err => {
        res.json({
            messgae:"notcreated"
        })
    })
})

route.delete('/:productId', (req,res)=>{
    const id = req.params.productId;
    Product.remove({_id:id})
    .then(result =>{
        res.json({
            message:"product Deleted Successfully",
            info:{
                url : "http://localhost:1000/product",
                method : "GET"
            }
        });
    })
    .catch(err =>{
        res.json({err:err})
    })
})






route.patch('/:productId',(req,res)=>{
    const id = req.params.productId;
    const newObj = {}
    for (const ops of req.body){
        newObj[ops.propName] = ops.value
    }
    Product.updateMany({_id:id},{$set: newObj})
    .then(result => {
        res.status(200).json({
            message : "Product Updated Successfully" 
        })
    })
    .catch(err => {
        res.status(500).json({
            err :err
        })
    })
    
})


module.exports = route;