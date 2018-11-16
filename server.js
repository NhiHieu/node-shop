const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const app = express();

//middleware
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


//connect mongo
mongoose.connect(`mongodb://node-shop:${process.env.YOURPW}@firstcluster-shard-00-00-ox430.mongodb.net:27017,firstcluster-shard-00-01-ox430.mongodb.net:27017,firstcluster-shard-00-02-ox430.mongodb.net:27017/test?ssl=true&replicaSet=FirstCluster-shard-0&authSource=admin&retryWrites=true`)

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Reqested-With, Content-Type, Accept, Authorization"
    )
    if(res.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", 'PUT, PATCH, POST, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})


//api
const productRoutes = require('./api/route/productRoutes')();
const orderRoutes = require('./api/route/orderRoutes')();


app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

//handle err
app.use((req, res, next)=>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
            
        }
    })
})

app.listen(port, ()=>{
    console.log(`Listerning op port ${port}`)
})