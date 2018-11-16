const Product = require('../model/products')

const productController = function(){
    const getProduct = (req, res, next)=>{
        res.status(200).json({
            message: "Here is get '/' in product route",
            body: req.body
        })
    }
    return getProduct;
}

module.exports = productController;