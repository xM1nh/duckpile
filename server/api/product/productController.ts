import { body, validationResult } from 'express-validator'
import pool from '../../config/dbConfig'
import * as product_queries from './productQueries'
import asyncHandler from 'express-async-handler'
import path from 'path'
import fs from 'fs'
import { image_create } from '../images/imageQueries'
import { uploadMulti } from '../../middleware/multerHelper'

export const product_list = asyncHandler(async (req, res, next) => {
    const pagination = {
        limit: Number(req.query.count),
        offset: (Number(req.query.page) - 1) * Number(req.query.count)
    }
    const products = await pool.query(product_queries.get_all_products, [pagination.limit, pagination.offset])
    const totalProducts = await pool.query(product_queries.get_product_count)
    const productsUpdatedImageURL = products.rows.map((row: any) => {
        if (row.image) {
           const {image, ...rest} = row
           const imagePath = path.join('..', image)
           return {imagePath, ...rest}
        } else {
            return row
        }
    })
    res.status(200).json({products: productsUpdatedImageURL, count: totalProducts.rows[0].count})
})

export const product_detail = asyncHandler(async (req, res, next) => {
    const product_id = parseInt(req.params.id)

    const general = await pool.query(product_queries.product_general_detail, [product_id])
    const images = await pool.query(product_queries.product_images, [product_id])
    const show = await pool.query(product_queries.product_show_detail, [product_id])

    const imgUrl = images.rows[0]
                    ? images.rows[0].file_paths.map((file_path : any) => {
                        const url = path.join('..', file_path)
                        file_path = url
                        return url
                    })
                    : []
    
    let lastestShow = {
        show: 'N/A',
        date: 'N/A',
        price: 'N/A',
        content: 'N/A'
    }
    if (show.rows[0]) {
        lastestShow = show.rows[0]
    }
    
    res.status(200).json({general: general.rows[0], images: imgUrl, show: lastestShow})
})

export const product_create_post = [
    uploadMulti.array('images'),

    body('name', 'Product name must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('type')
        .trim()
        .escape(),
    body('brand')
        .trim()
        .escape(),
    body('sku')
        .trim()
        .escape(),
    body('price', 'Product price must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('discount')
        .trim()
        .escape(),
    body('expDate')
        .trim()
        .escape(),
    body('content')
        .trim()
        .escape(),
    body('store1_inv')
        .trim()
        .escape(),
    body('store2_inv')
        .trim()
        .escape(),
    body('store3_inv')
        .trim()
        .escape(),
        
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const product = {
            name: req.body.name,
            type: req.body.type,
            brand: req.body.brand,
            sku: req.body.sku,
            price: req.body.price,
            discount: req.body.discount,
            supplier: req.body.supplier,
            expDate: req.body.expired_date,
            content: req.body.content,
            store1_inv: req.body.store1_inv,
            store2_inv: req.body.store2_inv,
            store3_inv: req.body.store3_inv,
        }

        if(!errors.isEmpty()) {
            res.status(400).json(errors)
        } else {
            const client = await pool.connect()

            try {
                await client.query('BEGIN')
                const create_product = await client.query(product_queries.product_create, [product.name, product.type, product.brand, product.supplier, product.sku, product.content, product.expDate, product.price, product.discount, product.store1_inv, product.store2_inv, product.store3_inv])
                const productId = create_product.rows[0].id

                var filePaths: string[] = []
                if (req.files?.length !== 0) {
                    const files = req.files as Express.Multer.File[]
                    const tempPath = files[0].destination

                    try {
                        const newPath = `./uploads/${productId}`
                        fs.renameSync(tempPath, newPath)
                    } catch (err) {
                        fs.rmSync('./uploads/temp', { recursive: true, force: true })
                        throw(err)
                    }

                    filePaths = files.map(file => {
                        return file.path.replace('temp', `${productId}`)
                    })
                }

                await client.query(image_create, [productId, filePaths])
                await client.query('COMMIT')

                res.status(200).json({message: 'Success', productId})
            } catch (err) {
                await client.query('ROLLBACK')

                //Removed the newly added directory
                //Newly added directory can be named 'temp' or `${productId}`
                //depends on where the try block fails.
                if (req.files?.length !== 0) {
                    const uploads = fs.readdirSync('./uploads')
                    const latestDir = uploads.sort((a, b) => {
                        return fs.statSync('./uploads/' + a).mtime.getTime() - fs.statSync('./uploads/' + b).mtime.getTime()
                    })[0]
                    fs.rmSync(latestDir, { recursive: true, force: true })
                }
                
                res.status(500).json({error: err})
            } finally {
                client.release()
            }
        }
    }),
]

export const product_delete_post = asyncHandler(async (req, res, next) => {
    const productID = parseInt(req.params.id)
    fs.readdir('./uploads', function(err ,list) {
        const productFolder = list.filter(folder => folder === productID.toString())[0]
        if (productFolder) {
            fs.rmSync(`./uploads/${productFolder}`, {recursive: true, force: true})
        }
    })
    await pool.query(product_queries.product_delete, [productID])
    res.status(200).json({message: 'Success'})
})

export const product_update_post = [
    body('product_name', 'Product name must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('type')
        .trim()
        .escape(),
    body('brand')
        .trim()
        .escape(),
    body('sku')
        .trim()
        .escape(),
    body('price', 'Product price must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('discount')
        .trim()
        .escape(),
    body('expired_date')
        .trim()
        .escape()
        .toDate(),
    body('content')
        .trim()
        .escape(),
    body('store1_inv')
        .trim()
        .escape()
        .toInt(),
    body('store2_inv')
        .trim()
        .escape()
        .toInt(),
    body('store3_inv')
        .trim()
        .escape()
        .toInt(),
        
    asyncHandler(async (req, res, next) => {
        const id = parseInt(req.params.id)
        const errors = validationResult(req)
        const product = {
            name: req.body.product_name,
            type: req.body.type,
            brand: req.body.brand,
            sku: req.body.sku,
            price: Number(req.body.price),
            discount: Number(req.body.discount),
            supplier: parseInt(req.body.supplier_id),
            expDate: req.body.expired_date,
            content: req.body.content,
            store1_inv: req.body.inventory_store_1,
            store2_inv: req.body.inventory_store_2,
            store3_inv: req.body.inventory_store_3,
        }
        
        if(!errors.isEmpty()) {
            res.status(400).json({ errors })
        } else {
            //This will return the newly created product's id
            await pool.query(product_queries.product_update, [product.name, product.type, product.brand, product.supplier, product.sku, product.content, product.expDate, product.price, product.discount, product.store1_inv, product.store2_inv, product.store3_inv, id])

            res.status(200).json({message: 'Success'})
        }
    })
]