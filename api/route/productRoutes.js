const express = require('express')
const Product = require('../model/products');
const productRouter = express.Router();
//const { getProduct } = require('../controller/productController');
function router(){
    productRouter.route('/')
        .get((req, res, next)=>{
            Product.find((err, docs)=>{
                if(err)
                    res.status(404).json({
                        mess: "Not found"
                    })
                res.status(200).json({
                    message: "All product",
                    doc: docs.map((doc)=>{
                        return{
                            name: doc.name,
                            price: doc.price,
                            id: doc._id,
                            request:{
                                type: 'GET',
                                url: 'http://localhost:3000/product/' + doc._id
                            }
                        }
                    })
                    })
                    
                })
            })

        .post((req, res, next)=>{
            let {name, price} = req.body;
            let product = new Product({
                name: name,
                price: price
            })
            product.save(function(err){
                if(err)
                    res.status(404).json({
                        mess: "Invalid"
                    })
                
                res.status(200).json({
                    message: "Add product",
                    product: product,
                })
            })
            //console.log(req.body.price)
            
        })


    productRouter.route('/:productId')
        .get((req, res, next)=>{
            const { productId } = req.params;
            console.log(productId);
            Product.findById(productId, function(err, product){
                console.log(product)
                if(err)
                    res.status(404).json({
                        mess: err
                    })
                res.status(200).json({
                    mess: "We already save product, so we can show it!",
                    product: product
                })
            })
        })

    productRouter.route('/:productId')
        .patch((req, res,next)=>{
            const { productId } = req.params;
            Product.findById(productId, (err, doc)=>{
                if(err)
                    res.status(404).json({
                        mess: "Not found!"
                    })
                
                doc.name = 'Nhi Hieu 123'
                doc.save((error)=>{
                    if(error)
                        res.status(404).json({})
                    console.log(doc)
                    res.status(200).json({
                        mess: "success",
                        doc: doc
                    })
                })
            })
        })

    productRouter.route('/:productId')
        .delete((req, res, next)=>{
            const { productId } = req.params;
            Product.findByIdAndDelete({_id: productId}, (err)=>{
                if(err)
                    res.status(500).json({
                        mess: 'Cannot delete'
                    })
                res.status(200).json({
                    mess: "Deleted"
                })
            })
        })
    return productRouter;
}

module.exports = router;