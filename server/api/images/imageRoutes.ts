import express from 'express'
import * as image_controller from './imageController'
const router = express.Router()

router.get('/', image_controller.image_list)

router.get('/image/:filename', image_controller.get_one_image)

router.post('/:productID/image/create', image_controller.image_create_post)

router.get('/image/:id/delete', image_controller.image_delete_get)

router.post('/image/:id/delete', image_controller.image_delete_post)

router.get('/image/:id/udpate', image_controller.image_update_get)

router.post('/image/:id/update', image_controller.image_update_post)

export = router