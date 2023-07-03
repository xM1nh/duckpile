import pool from '../../database'
import * as inventory_queries from './inventoryQueries'
import asyncHandler from 'express-async-handler'

export const inventory_list = asyncHandler(async (req, res, next) => {
    const inventory = await pool.query(inventory_queries.get_all_inventory)
    const store1 = inventory.rows.map((row :{product_name: string, inventory_store_1: number, product_id: number}) => {
        const {product_name, inventory_store_1, product_id, ...rest} = row
        return {product_name, quantity: inventory_store_1, product_id}
    })
    const store2 = inventory.rows.map((row :{product_name: string, inventory_store_2: number, product_id: number}) => {
        const {product_name, inventory_store_2, product_id, ...rest} = row
        return {product_name, quantity: inventory_store_2, product_id}
    })
    const store3 = inventory.rows.map((row :{product_name: string, inventory_store_3: number, product_id: number}) => {
        const {product_name, inventory_store_3, product_id, ...rest} = row
        return {product_name, quantity: inventory_store_3, product_id}
    })

    res.status(200).json({store1, store2, store3})
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