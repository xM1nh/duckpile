import express from 'express'
import * as supplier_controller from './supplierController'
const router = express.Router()

router.get('/', supplier_controller.supplier_list)

router.get('/supplier/:id', supplier_controller.supplier_detail)

router.get('/supplier/create', supplier_controller.supplier_delete_get)

router.post('/supplier/create', supplier_controller.supplier_create_post)

router.get('/supplier/:id/delete', supplier_controller.supplier_delete_get)

router.post('/supplier/:id/delete', supplier_controller.supplier_delete_post)

router.get('/supplier/:id/udpate', supplier_controller.supplier_update_get)

router.post('/supplier/:id/update', supplier_controller.supplier_update_post)

export = router