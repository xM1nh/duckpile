import pool from '../../config/dbConfig'
import * as store_queries from './storeQueries'
import asyncHandler from 'express-async-handler'

export const store_list = asyncHandler(async (req, res, next) => {
    const stores = await pool.query(store_queries.get_all_stores)
    res.status(200).json(stores.rows)
})

export const store_detail = asyncHandler(async (req, res, next) => {
    res.send('not implemented: store detail')
})

export const store_create_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: store create get')
})

export const store_create_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: store create post')
})

export const store_delete_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: store delete get')
})

export const store_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: store delete post')
})

export const store_update_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: store update get')
})

export const store_update_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: store update post')
})