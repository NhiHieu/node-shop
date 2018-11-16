const express = require('express')
const Order = require('../model/orders')
const Product = require('../model/products')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024*1024*5
    }
});
const orderRouter = express.Router()


function router(){

    orderRouter.route('/')
        .get((req ,res, next)=>{
            Order.find()
                .populate('product')
                .exec((err, docs)=>{
                    if(err)
                        console.log(err)
                    else{
                            res.status(200).json({
                    mess: "Get all orders",
                    doc: docs.map((doc)=>{
                        return{
                            productId: doc.product._id,
                            quantity: doc.quantity,
                            name: doc.name,
                            price: doc.price,
                            id: doc._id,
                            request:{
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + doc.product._id
                                }
                          }
                        })
                    })
                    }
                })
        })
    
    orderRouter.route('/')
        .post(upload.single('avatar'),(req, res, next)=>{
            console.log(req.file);
            let { quantity } = req.body;
            console.log(quantity)
            let productId = req.body.productId;
            //res.send(req.body)
            console.log(productId)
            Product.findById(productId, (err, doc)=>{
                console.log("Inside findById Product")
                console.log(doc)
                if(err)
                    res.status(404).json({
                        message: "Not Found product",
                        err: err
                    })
                else{
                    let order = new Order({
                        product: productId,
                        quantity : quantity
                    })
                    console.log("Order:" + order)
                    order.save(function(err){
                        if(err)
                            res.status(500).json({
                                mess: "Something wrong with server",
                                error: err
                            })
                        else{
                        res.status(200).json({
                            mess: "saved order",
                            createOrder: order
                        })
                    }
                    })
                }
            })
            

        })

    orderRouter.route('/:orderId')
        .delete((req, res, next)=>{
            let { orderId } = req.params;
            Order.findOneAndDelete(orderId, (err)=>{
                if(err){
                    res.status(500).json({
                        err: err
                    })
                }
                else{
                    res.status(200).json({
                        message: "deleted"
                    })
                }
            })
        })


    //orderRouter.route('')
    return orderRouter;
}



module.exports = router;


