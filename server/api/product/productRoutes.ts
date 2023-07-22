import express from 'express'
import * as product_controller from './productController'
const router = express.Router()

router.get('/', product_controller.product_list)

router.get('/:id', product_controller.product_detail)

router.post('/', product_controller.product_create_post)

router.delete('/:id', product_controller.product_delete_post)

router.put('/:id', product_controller.product_update_post)

export = router