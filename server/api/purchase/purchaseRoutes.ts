import express from 'express'
import * as purchase_controller from './purchaseController'
const router = express.Router()

router.get('/', purchase_controller.purchase_list)

router.get('/purchase/:id', purchase_controller.purchase_detail)

router.get('/create', purchase_controller.purchase_create_get)

router.post('/create', purchase_controller.purchase_create_post)

router.post('/purchase/:id/delete', purchase_controller.purchase_delete_post)

router.get('/purchase/:id/update', purchase_controller.purchase_update_get)

router.post('/purchase/:id/update', purchase_controller.purchase_update_post)

export = router