import express from 'express'
import * as sale_controller from './saleController'
const router = express.Router()

router.get('/:page/:limit', sale_controller.sale_list)

router.get('/sale/:id', sale_controller.sale_detail)

router.get('/sale/create', sale_controller.sale_delete_get)

router.post('/sale/create', sale_controller.sale_create_post)

router.get('/sale/:id/delete', sale_controller.sale_delete_get)

router.post('/sale/:id/delete', sale_controller.sale_delete_post)

router.get('/sale/:id/udpate', sale_controller.sale_update_get)

router.post('/sale/:id/update', sale_controller.sale_update_post)

export = router