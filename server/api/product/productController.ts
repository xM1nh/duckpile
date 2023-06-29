import { body, validationResult } from 'express-validator'
import pool from '../../database'
import * as product_queries from './productQueries'
import asyncHandler from 'express-async-handler'
import path from 'path'

export const product_list = asyncHandler(async (req, res, next) => {
    const products = await pool.query(product_queries.get_all_products)
    const productsUpdatedURL = products.rows.map((row: any) => {
        if (row.image) {
           const {image, ...rest} = row
           const imagePath = path.join('..', image)
           return {...rest, imagePath}
        } else {
            return row
        }
    })
    res.status(200).json(productsUpdatedURL)
})

export const paginated_product_get = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.params.page)
    const limit = parseInt(req.params.limit)
    const offset = (page - 1) * limit
    const products = await pool.query(product_queries.get_paginated_products, [limit, offset])
    const productsUpdatedURL = products.rows.map((row: any) => {
        if (row.image) {
           const {image, ...rest} = row
           const imagePath = path.join('..', image)
           return {imagePath, ...rest}
        } else {
            return row
        }
    })
    res.status(200).json(productsUpdatedURL)
})

export const product_detail = asyncHandler(async (req, res, next) => {
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

    const sales = await pool.query(product_queries.product_sales_detail, [product_id])
    const purchase = await pool.query(product_queries.product_purchase_detail, [product_id])
    const inventory = await pool.query(product_queries.product_inventory_detail, [product_id])
    const show = await pool.query(product_queries.product_show_detail, [product_id])
    
    res.status(200).json({general: general.rows[0], images: imgUrl, inventory: inventory.rows, sales: sales.rows, purchases: purchase.rows, show: show.rows[0]})
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
            expDate: req.body.expDate,
            content: req.body.content,
        }

        if(!errors.isEmpty()) {
            res.status(400).json({ errors })
        } else {
            //This will return the newly created product's id
            const create_product = await pool.query(product_queries.product_create, [product.name, product.type, product.brand, product.supplier, product.sku, product.content, product.expDate, product.price, product.discount])
            const productID = create_product.rows[0].id

            res.status(200).json({message: 'Success', productID})
        }
    })
]

export const product_delete_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: product delete get')
})

export const product_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: product delete post')
})

export const product_update_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: product update get')
})

export const product_update_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: product update post')
})