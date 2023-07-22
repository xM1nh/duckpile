import express from 'express'
import * as customer_controller from './customerController'
const router = express.Router()

router.get('/', customer_controller.customer_list)

router.get('/:id', customer_controller.customer_detail)

router.post('/', customer_controller.customer_create_post)

router.delete('/:id', customer_controller.customer_delete_post)

router.put('/:id', customer_controller.customer_update_post)

export = router