require('dotenv').config({path:'../.env'})

import express from 'express'

const app = express()
const port = 3001

app.use(express.json())

import productRoute from './api/product/productRoutes'
import purchaseRoute from './api/purchase/purchaseRoutes'
import inventoryRoute from './api/inventory/inventoryRoutes'
import customerRoute from './api/customer/customerRoutes'
import saleRoute from './api/sale/saleRoutes'
import supplierRoute from './api/supplier/supplierRoutes'

app.use('/api/v1/products', productRoute)
app.use('/api/v1/purchases', purchaseRoute)
app.use('/api/v1/inventory', inventoryRoute)
app.use('/api/v1/customers', customerRoute)
app.use('/api/v1/sales', saleRoute)
app.use('/api/v1/suppliers', supplierRoute)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})