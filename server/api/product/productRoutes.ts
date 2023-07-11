import express from 'express'
import * as product_controller from './productController'
const router = express.Router()

router.get('/', product_controller.product_list)

router.get('/product/:id', product_controller.product_detail)

router.post('/create', product_controller.product_create_post)

router.post('/product/:id/delete', product_controller.product_delete_post)

router.get('/product/:id/update', product_controller.product_update_get)

router.post('/product/:id/update', product_controller.product_update_post)

export = router