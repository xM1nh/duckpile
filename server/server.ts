require('dotenv').config()

import express from 'express'
import cors from 'cors'
import logger from './middleware/logger'
import errorHandler from './middleware/errorHandler'
import corsOptions from './config/corsConfig'

const app = express()
const port = 3001

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

import veriyfJwt from './middleware/verifyJwt'
import productRoute from './api/product/productRoutes'
import purchaseRoute from './api/purchase/purchaseRoutes'
import inventoryRoute from './api/inventory/inventoryRoutes'
import customerRoute from './api/customer/customerRoutes'
import saleRoute from './api/sale/saleRoutes'
import supplierRoute from './api/supplier/supplierRoutes'
import imageRoute from './api/images/imageRoutes'

//app.use(veriyfJwt)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/purchases', purchaseRoute)
app.use('/api/v1/inventory', inventoryRoute)
app.use('/api/v1/customers', customerRoute)
app.use('/api/v1/sales', saleRoute)
app.use('/api/v1/suppliers', supplierRoute)
app.use('/api/v1/uploads', imageRoute)
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})