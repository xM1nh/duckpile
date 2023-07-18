import pool from '../../config/dbConfig'
import * as staff_queries from './staffQueries'
import asyncHandler from 'express-async-handler'

export const staff_list = asyncHandler(async (req, res, next) => {
    const staffs = await pool.query(staff_queries.get_all_staffs)
    res.status(200).json(staffs.rows)
})

export const staff_detail = asyncHandler(async (req, res, next) => {
    res.send('not implemented: staff detail')
})

export const staff_create_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: staff create get')
})

export const staff_create_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: staff create post')
})

export const staff_delete_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: staff delete get')
})

export const staff_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: staff delete post')
})

export const staff_update_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: staff update get')
})

export const staff_update_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: staff update post')
})