import pool from '../../database'
import * as sale_queries from './saleQueries'
import {get_all_customers, customer_create, customer_update} from '../customer/customerQueries'
import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'

export const sale_list = asyncHandler(async (req, res, next) => {
    const pagination = {
        limit: req.query.count,
        offset: (Number(req.query.page) - 1) * Number(req.query.count)
    }
    const sales = await pool.query(sale_queries.get_all_sales, [pagination.limit, pagination.offset])
    const salesCount = await pool.query(sale_queries.get_sale_count)
    const most_buyed_product = await pool.query(sale_queries.get_most_buyed_product)
    const most_buyed_customer = await pool.query(sale_queries.get_most_buyed_customer)

    const response = sales.rows.map((row: {products: string[]}) => {
        var {products, ...rest} = row
        let result: string = ''
        row.products.forEach(product => {
            const name = product.split(',')[0]
            const quantity = product.split(',')[1]
            const value = quantity + 'x' + ' ' + name + ', '
            result += value
        })
        return {result, ...rest}
    })
    res.status(200).json({summary: response, count: salesCount.rows[0].count, mostBuyedProduct: most_buyed_product.rows[0].name, mostBuyedCustomer: most_buyed_customer.rows[0].customer_name})
})

export const sale_detail = asyncHandler(async (req, res, next) => {
    res.send('not implemented: sale detail')
})

export const sale_create_get = asyncHandler(async (req, res, next) => {
    const products = await pool.query('SELECT products.name, products.price, products.id FROM products')
    const customers = await pool.query(get_all_customers, [null, null])
    const stores = await pool.query('SELECT stores.store_name as name, stores.id FROM stores')
    res.status(200).json({products: products.rows, customers: customers.rows, stores: stores.rows})
})

export const sale_create_post = [
    body('customer_name')
        .trim()
        .escape(),
    body('customer_phone')
        .trim()
        .escape(),
    body('customer_street')
        .trim()
        .escape(),  
    body('customer_city')
        .trim()
        .escape(), 
    body('customer_state')
        .trim()
        .escape(), 
    body('customer_zip')
        .trim()
        .escape(),
    body('products', 'Products must not be empty')
        .trim(),
    body('store_name')
        .trim()
        .escape(),
    body('staff', 'Staff name must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('date')
        .trim()
        .escape()
        .toDate(),
    body('total')
        .toInt(),
    body('customer_id')
        .toInt(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const sale = {
            customer: {
                id: req.body.customer_id ? req.body.customer_id : null,
                first_name: req.body.customer_name ? req.body.customer_name.split(' ')[0] : null,
                last_name: req.body.customer_name ? req.body.customer_name.split(' ')[1] : null,
                phone_number: req.body.customer_phone ? parseInt(req.body.customer_phone) : null,
                street: req.body.customer_street ? req.body.customer_street : null,
                city: req.body.customer_city ? req.body.customer_city : null,
                state: req.body.customer_state ? req.body.customer_state : null,
                zip: req.body.customer_zip ? parseInt(req.body.customer_zip) : null
            },
            products: JSON.parse(req.body.products),
            staff: req.body.staff,
            store: {
                name: req.body.store_name,
                id: req.body.store_id
            },
            date: req.body.date,
            payment_method: req.body.payment_method,
            total: req.body.total
        }
        if (!errors.isEmpty()) {
            res.status(400).json(errors)
        } else {
            const client = await pool.connect()
            let message = ''

            try {
                if (!sale.customer.id) {
                    if (sale.customer.phone_number) {
                        const customer = await client.query(customer_create, [
                            sale.customer.first_name,
                            sale.customer.last_name,
                            sale.customer.phone_number,
                            sale.customer.street,
                            sale.customer.city,
                            sale.customer.state,
                            sale.customer.zip
                        ])
                        sale.customer.id = customer.rows[0].id
                        message = 'Successfully created customer'
                    }
                } else {
                    await client.query(customer_update, [
                        sale.customer.first_name,
                        sale.customer.last_name,
                        sale.customer.street,
                        sale.customer.city,
                        sale.customer.state,
                        sale.customer.zip,
                        sale.customer.phone_number,
                        sale.customer.id
                    ])
                    message = 'Successfully updated customer information'
                }
                const saleID = await client.query(sale_queries.sale_create, [sale.date, sale.store.id, sale.staff, sale.payment_method, sale.customer.id, sale.total])
                sale.products.forEach(async (product: {id: Number, quantity: Number}) => {
                    await client.query(`INSERT INTO sale_products (sale_id, product_id, quantity) VALUES ($1, $2, $3)`, [saleID.rows[0].id, product.id, product.quantity])
                })
                res.status(200).json({id: saleID.rows[0].id, message: message})
            } catch (err) {
                await client.query('ROLLBACK')
                res.status(400).json(err)
            } finally {
                client.release()
            }
        }
    })
]


export const sale_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: sale delete post')
})

export const sale_update_get = asyncHandler(async (req, res, next) => {
    res.send('not implemented: sale update get')
})

export const sale_update_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: sale update post')
})