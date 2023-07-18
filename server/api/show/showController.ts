import pool from '../../config/dbConfig'
import * as show_queries from './showQueries'
import asyncHandler from 'express-async-handler'

export const show_list = asyncHandler(async (req, res, next) => {
    const data = await pool.query(show_queries.get_all_show)
    res.status(200).json(data)
})

export const show_detail = asyncHandler(async (req, res, next) => {
    res.send('not implemented: show detail')
})

export const show_create_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: show create get')
})

export const show_create_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: show create post')
})

export const show_delete_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: show delete get')
})

export const show_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: show delete post')
})

export const show_update_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: show update get')
})

export const show_update_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: show update post')
})