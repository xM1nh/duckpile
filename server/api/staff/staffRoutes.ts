import express from 'express'
import * as staff_controller from './staffController'
const router = express.Router()

router.get('/', staff_controller.staff_list)

router.get('/staff/:id', staff_controller.staff_detail)

router.get('/staff/create', staff_controller.staff_delete_get)

router.post('/staff/create', staff_controller.staff_create_post)

router.get('/staff/:id/delete', staff_controller.staff_delete_get)

router.post('/staff/:id/delete', staff_controller.staff_delete_post)

router.get('/staff/:id/udpate', staff_controller.staff_update_get)

router.post('/staff/:id/update', staff_controller.staff_update_post)

export = router