require('dotenv').config({path:'../.env'})

import express from 'express'
const app = express()
const port = 3001

app.use(express.json())

import productRoute from './api/product/productRoutes'

app.use('/api/v1/products', productRoute)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})