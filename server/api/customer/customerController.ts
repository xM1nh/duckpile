import pool from '../../database'
import * as customer_queries from './customerQueries'
import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'

export const customer_list = asyncHandler(async (req, res, next) => {
    const customers = await pool.query(customer_queries.get_all_customers)
    res.status(200).json(customers.rows)
})

export const customer_detail = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id)
    const customer = await pool.query(customer_queries.customer_detail, [id])
    const sales = await pool.query(customer_queries.customer_buy_detail, [id])

    const totalSales = sales.rows.length
    const totalValue = sales.rows.reduce((sum: number, curr: {quantity: number, xxxidxxx: number}) => {
        return sum + curr.quantity * curr.xxxidxxx
    }, 0)

    const mostBuyedProduct = () => {
        const productMap: {[key:string]: number} = {}
        sales.rows.forEach((row: {product_name: string}) => {
            if (!productMap[row.product_name]) {
                productMap[row.product_name] = 1
            } else {
                productMap[row.product_name]++
            }
        })

        const returns = Object.entries(productMap).sort((a,b) => b[1] - a[1])
        return returns.shift()
    }

    res.status(200).json({general: customer.rows[0], sales: {list: sales.rows, mostBuyedProduct: mostBuyedProduct(), totalSales: totalSales, totalValue: totalValue}})
})

export const customer_create_post = [
    body('firstName', 'First name must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('lastName', 'Last name must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('phoneNumber')
        .trim()
        .isLength({min: 10, max: 10})
        .escape(),
    body('street')
        .trim()
        .escape(),
    body('city')
        .trim()
        .escape(),
    body('state')
        .trim()
        .escape(),
    body('zip')
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const customer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: parseInt(req.body.phoneNumber),
            street: req.body.street === '' ? null : req.body.street,
            city: req.body.city === '' ? null : req.body.city,
            state: req.body.state === '' ? null : req.body.state,
            zip: req.body.zip === '' ? null : req.body.zip,
        }

        if (!errors.isEmpty()) {
            res.status(400).json(errors)
        } else {
            const createCustomer = await pool.query(customer_queries.customer_create, [customer.firstName, customer.lastName, customer.phoneNumber, customer.street, customer.city, customer.state, customer.zip])
            const customerID = createCustomer.rows[0].id

            res.status(200).json({message: 'Success', id: customerID})
        }
    })
]

export const customer_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: customer delete post')
})

export const customer_update_get = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id)
    const customer = await pool.query(customer_queries.customer_detail, [id])
    res.status(200).json(customer.rows[0])
})

export const customer_update_post = [
    body('first_name', 'First name must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('last_name', 'Last name must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('phone_number')
        .trim()
        .isLength({min: 10, max: 10})
        .escape(),
    body('street')
        .trim()
        .escape(),
    body('city')
        .trim()
        .escape(),
    body('state')
        .trim()
        .escape(),
    body('zip')
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        const id = parseInt(req.params.id)
        const errors = validationResult(req)

        const customer = {
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            phoneNumber: parseInt(req.body.phone_number),
            street: req.body.street === '' ? null : req.body.street,
            city: req.body.city === '' ? null : req.body.city,
            state: req.body.state === '' ? null : req.body.state,
            zip: req.body.zip === '' ? null : req.body.zip,
        }

        if (!errors.isEmpty()) {
            res.status(400).json(errors)
        } else {
            await pool.query(customer_queries.customer_update, [customer.firstName, customer.lastName, customer.street, customer.city, customer.state, customer.zip, customer.phoneNumber, id])
            res.status(200).json({message: 'Updated'})
        }
    })
]