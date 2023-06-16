import pool from '../../database'
import * as purchase_queries from './purchaseQueries'
import asyncHandler from 'express-async-handler'

export const purchase_list = asyncHandler(async (req, res, next) => {
    const purchases = await pool.query(purchase_queries.get_all_purchases)
    res.status(200).json(purchases.rows)
})

export const purchase_detail = asyncHandler(async (req, res, next) => {
    res.send('not implemented: purchase detail')
})

export const purchase_create_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: purchase create get')
})

export const purchase_create_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: purchase create post')
})

export const purchase_delete_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: purchase delete get')
})

export const purchase_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: purchase delete post')
})

export const purchase_update_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: purchase update get')
})

export const purchase_update_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: purchase update post')
})