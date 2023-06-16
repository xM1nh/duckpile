import pool from '../../database'
import * as supplier_queries from './supplierQueries'
import asyncHandler from 'express-async-handler'

export const supplier_list = asyncHandler(async (req, res, next) => {
    const suppliers = await pool.query(supplier_queries.get_all_suppliers)
    res.status(200).json(suppliers.rows)
})

export const supplier_detail = asyncHandler(async (req, res, next) => {
    res.send('not implemented: supplier detail')
})

export const supplier_create_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: supplier create get')
})

export const supplier_create_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: supplier create post')
})

export const supplier_delete_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: supplier delete get')
})

export const supplier_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: supplier delete post')
})

export const supplier_update_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: supplier update get')
})

export const supplier_update_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: supplier update post')
})