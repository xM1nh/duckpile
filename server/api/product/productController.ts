import pool from '../../database'
import * as product_queries from './productQueries'
import asyncHandler from 'express-async-handler'

export const product_list = asyncHandler(async (req, res, next) => {
    const products = await pool.query(product_queries.get_all_products)
    res.status(200).json(products.rows)
})

export const paginated_product_get = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.params.page)
    const limit = parseInt(req.params.limit)
    const offset = (page - 1) * limit
    const products = await pool.query(product_queries.get_paginated_products, [limit, offset])
    res.status(200).json(products.rows)
})

export const product_detail = asyncHandler(async (req, res, next) => {
    const product_id = parseInt(req.params.id)
    const general = await pool.query(product_queries.product_general_detail, [product_id])
    const sales = await pool.query(product_queries.product_sales_detail, [product_id])
    const purchase = await pool.query(product_queries.product_purchase_detail, [product_id])
    const inventory = await pool.query(product_queries.product_inventory_detail, [product_id])
    const show = await pool.query(product_queries.product_show_detail, [product_id])
    res.status(200).json({general: general.rows[0], inventory: inventory.rows, sales: sales.rows, purchases: purchase.rows, show: show.rows[0]})
})

export const product_create_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: product create get')
})

export const product_create_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: product create post')
})

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