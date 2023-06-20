require('dotenv').config({path:'../.env'})

import express from 'express'
const app = express()
const port = 3001

app.use(express.json())

import productRoute from './api/product/productRoutes'
import purchaseRoute from './api/purchase/purchaseRoutes'

app.use('/api/v1/products', productRoute)
app.use('/api/v1/purchases', purchaseRoute)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})