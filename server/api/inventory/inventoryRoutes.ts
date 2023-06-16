import express from 'express'
import * as inventory_controller from './inventoryController'
const router = express.Router()

router.get('/', inventory_controller.inventory_list)

router.get('/inventory/:id', inventory_controller.inventory_detail)

router.get('/inventory/create', inventory_controller.inventory_delete_get)

router.post('/inventory/create', inventory_controller.inventory_create_post)

router.get('/inventory/:id/delete', inventory_controller.inventory_delete_get)

router.post('/inventory/:id/delete', inventory_controller.inventory_delete_post)

router.get('/inventory/:id/udpate', inventory_controller.inventory_update_get)

router.post('/inventory/:id/update', inventory_controller.inventory_update_post)

export = router