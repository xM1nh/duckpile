import pool from '../../database'
import * as customer_queries from './customerQueries'
import asyncHandler from 'express-async-handler'

export const customer_list = asyncHandler(async (req, res, next) => {
    const customers = await pool.query(customer_queries.get_all_customers)
    res.status(200).json(customers.rows)
})

export const customer_detail = asyncHandler(async (req, res, next) => {
    res.send('not implemented: customer detail')
})

export const customer_create_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: customer create get')
})

export const customer_create_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: customer create post')
})

export const customer_delete_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: customer delete get')
})

export const customer_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: customer delete post')
})

export const customer_update_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: customer update get')
})

export const customer_update_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: customer update post')
})