import pool from '../../config/dbConfig'
import * as image_queries from './imageQueries'
import asyncHandler from 'express-async-handler'
import { uploadMulti } from '../../middleware/multerHelper'
import path from 'path'

export const image_list = asyncHandler(async (req, res, next) => {
    const images = await pool.query(image_queries.get_all_images)
    res.status(200).json(images.rows)
})

export const get_one_image = asyncHandler(async (req, res, next) => {
    const filename = req.params.filename
    const imgPath = path.join(__dirname, 'uploads', filename)
    res.sendFile(imgPath)
})

export const image_create_post = [
    uploadMulti.array('images'),
    
    asyncHandler(async (req, res, next) => {
        const productID = req.params.productID

        var filePaths: string[] = []
        if (req.files) {
            const files = Array.from(req.files as Express.Multer.File[])
            filePaths = files.map(file => file.path)
        }

        const create_images = await pool.query(image_queries.image_create, [productID, filePaths])
        res.status(200).json({message: 'Success'})
    })
]

export const image_delete_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: image delete get')
})

export const image_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: image delete post')
})

export const image_update_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: image update get')
})

export const image_update_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: image update post')
})