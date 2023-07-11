import { body, validationResult } from 'express-validator'
import pool from '../../database'
import * as product_queries from './productQueries'
import asyncHandler from 'express-async-handler'
import path from 'path'
import fs from 'fs'

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
    const sales = await pool.query(product_queries.product_sales_detail, [product_id])
    const purchase = await pool.query(product_queries.product_purchase_detail, [product_id])
    const show = await pool.query(product_queries.product_show_detail, [product_id])

    const imgUrl = images.rows[0]
                    ? images.rows[0].file_paths.map((file_path : any) => {
                        const url = path.join('..', file_path)
                        file_path = url
                        return url
                    })
                    : []
    
    res.status(200).json({general: general.rows[0], images: imgUrl, inventory: '', sales: sales.rows, purchases: purchase.rows, show: show.rows[0]})
})

export const product_create_post = [
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
            //This will return the newly created product's id
            const create_product = await pool.query(product_queries.product_create, [product.name, product.type, product.brand, product.supplier, product.sku, product.content, product.expDate, product.price, product.discount])
            const productID = create_product.rows[0].id

            res.status(200).json({message: 'Success', productID})
        }
    })
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

export const product_update_get = asyncHandler(async (req, res, next) => {
    const product_id = parseInt(req.params.id)
    const general = await pool.query(product_queries.product_general_detail, [product_id])
    const images = await pool.query(product_queries.product_images, [product_id])
    
    const imgUrl = images.rows[0]
                    ? images.rows[0].file_paths.map((file_path : any) => {
                        const url = path.join('..', file_path)
                        file_path = url
                        return url
                    })
                    : []
    res.status(200).json({general: general.rows[0], images: imgUrl})
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
            store1_inv: parseInt(req.body.inventory_store_1),
            store2_inv: parseInt(req.body.inventory_store_2),
            store3_inv: parseInt(req.body.inventory_store_3),
        }
        
        if(!errors.isEmpty()) {
            res.status(400).json({ errors })
        } else {
            //This will return the newly created product's id
            const create_product = await pool.query(product_queries.product_update, [product.name, product.type, product.brand, product.supplier, product.sku, product.content, product.expDate, product.price, product.discount, product.store1_inv, product.store2_inv, product.store3_inv, id])

            res.status(200).json({message: 'Success'})
        }
    })
]