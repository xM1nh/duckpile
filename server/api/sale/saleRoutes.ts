import express from 'express'
import * as sale_controller from './saleController'
const router = express.Router()

router.get('/', sale_controller.sale_list)

router.get('/:id', sale_controller.sale_detail)

router.post('/', sale_controller.sale_create_post)

router.delete('/:id/', sale_controller.sale_delete_post)

router.put('/:id', sale_controller.sale_update_post)

export = router