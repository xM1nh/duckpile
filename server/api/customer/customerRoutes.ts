import express from 'express'
import * as customer_controller from './customerController'
const router = express.Router()

router.get('/', customer_controller.customer_list)

router.get('/customer/:id', customer_controller.customer_detail)

router.get('/customer/create', customer_controller.customer_delete_get)

router.post('/customer/create', customer_controller.customer_create_post)

router.get('/customer/:id/delete', customer_controller.customer_delete_get)

router.post('/customer/:id/delete', customer_controller.customer_delete_post)

router.get('/customer/:id/udpate', customer_controller.customer_update_get)

router.post('/customer/:id/update', customer_controller.customer_update_post)

export = router