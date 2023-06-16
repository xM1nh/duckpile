import pool from '../../database'
import * as sale_queries from './saleQueries'
import asyncHandler from 'express-async-handler'

export const sale_list = asyncHandler(async (req, res, next) => {
    const sales = await pool.query(sale_queries.get_all_sales)
    res.status(200).json(sales.rows)
})

export const sale_detail = asyncHandler(async (req, res, next) => {
    res.send('not implemented: sale detail')
})

export const sale_create_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: sale create get')
})

export const sale_create_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: sale create post')
})

export const sale_delete_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: sale delete get')
})

export const sale_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: sale delete post')
})

export const sale_update_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: sale update get')
})

export const sale_update_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: sale update post')
})