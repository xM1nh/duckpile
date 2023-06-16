import express from 'express'
import * as store_controller from './storeController'
const router = express.Router()

router.get('/', store_controller.store_list)

router.get('/store/:id', store_controller.store_detail)

router.get('/store/create', store_controller.store_delete_get)

router.post('/store/create', store_controller.store_create_post)

router.get('/store/:id/delete', store_controller.store_delete_get)

router.post('/store/:id/delete', store_controller.store_delete_post)

router.get('/store/:id/udpate', store_controller.store_update_get)

router.post('/store/:id/update', store_controller.store_update_post)

export = router