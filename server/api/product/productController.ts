import pool from '../../database'
import * as product_queries from './productQueries'
import asyncHandler from 'express-async-handler'

export const product_list = asyncHandler(async (req, res, next) => {
    const products = await pool.query(product_queries.get_all_products)
    res.status(200).json(products.rows)
})

export const product_detail = asyncHandler(async (req, res, next) => {
    res.send('not implemented: product detail')
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