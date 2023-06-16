import pool from '../../database'
import * as inventory_queries from './inventoryQueries'
import asyncHandler from 'express-async-handler'

export const inventory_list = asyncHandler(async (req, res, next) => {
    const inventory = await pool.query(inventory_queries.get_all_inventory)
    res.status(200).json(inventory.rows)
})

export const inventory_detail = asyncHandler(async (req, res, next) => {
    res.send('not implemented: inventory detail')
})

export const inventory_create_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: inventory create get')
})

export const inventory_create_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: inventory create post')
})

export const inventory_delete_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: inventory delete get')
})

export const inventory_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: inventory delete post')
})

export const inventory_update_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: inventory update get')
})

export const inventory_update_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: inventory update post')
})