import express from 'express'
import * as supplier_controller from './supplierController'
const router = express.Router()

router.get('/', supplier_controller.supplier_list)

router.get('/supplier/:id', supplier_controller.supplier_detail)

router.post('/create', supplier_controller.supplier_create_post)

router.post('/supplier/:id/delete', supplier_controller.supplier_delete_post)

router.get('/supplier/:id/update', supplier_controller.supplier_update_get)

router.post('/supplier/:id/update', supplier_controller.supplier_update_post)

export = router