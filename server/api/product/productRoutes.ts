import express from 'express'
import * as product_controller from './productController'
const router = express.Router()

router.get('/', product_controller.product_list)

router.get('/pages/:page/:limit', product_controller.paginated_product_get)

router.get('/product/:id', product_controller.product_detail)

router.post('/product/create', product_controller.product_create_post)

router.get('/product/:id/delete', product_controller.product_delete_get)

router.post('/product/:id/delete', product_controller.product_delete_post)

router.get('/product/:id/udpate', product_controller.product_update_get)

router.post('/product/:id/update', product_controller.product_update_post)

export = router