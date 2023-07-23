import pool from '../../config/dbConfig'
import * as sale_queries from './saleQueries'
import {get_all_customers, customer_create, customer_update} from '../customer/customerQueries'
import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'

export const sale_list = asyncHandler(async (req, res, next) => {
    const limit = (req.query.count === 'undefined')
        ? null
        : Number(req.query.count) 
    const offset = (req.query.count === 'undefined' && req.query.page === 'undefined') 
        ? null
        : (Number(req.query.page) - 1) * Number(req.query.count)

    const sales = await pool.query(sale_queries.get_all_sales, [limit, offset])
    const salesCount = await pool.query(sale_queries.get_sale_count)
    const most_buyed_product = await pool.query(sale_queries.get_most_buyed_product)
    const most_buyed_customer = await pool.query(sale_queries.get_most_buyed_customer)

    const response = sales.rows.map((row: {products: string[]}) => {
        var {products: productsRow, ...rest} = row
        const products = productsRow.map(product => {
            const product_name = product.split(',')[0]
            const quantity = parseInt(product.split(',')[1])
            const product_price = Number(product.split(',')[2])
            const product_id = parseInt(product.split(',')[3])
            return ({product_name, product_price, quantity, product_id})
        })
        return {products, ...rest}
    })
    res.status(200).json({sales: response, count: salesCount.rows[0].count, mostBuyedProduct: most_buyed_product.rows[0].name, mostBuyedCustomer: most_buyed_customer.rows[0].customer_name})
})

export const sale_detail = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id)
    const sale = await pool.query(sale_queries.sale_detail, [id])

    const response = {
        customer: {
            firstName: sale.rows[0].first_name, 
            lastName: sale.rows[0].last_name,
            street: sale.rows[0].street, 
            city: sale.rows[0].city, 
            state: sale.rows[0].state, 
            zip: sale.rows[0].zip,
            phone: sale.rows[0].phone_number,
            id: sale.rows[0].customer_id
        },
        sale: {
            products: sale.rows[0].products.map((product: string) => {
                const product_name = product.split(',')[0]
                const quantity = parseInt(product.split(',')[1])
                const product_price = Number(product.split(',')[2])
                const product_id = parseInt(product.split(',')[3])
                return ({product_name, product_price, quantity, product_id})
            }),
            totalAmount: sale.rows[0].total_amount,
            paymentMethod: sale.rows[0].payment_method
        },
        date: new Date(sale.rows[0].sale_date).toISOString().substring(0, 10),
        store: {
            name: sale.rows[0].store_name,
            id: sale.rows[0].store_id
        },
        staff: sale.rows[0].staff
    }

    res.status(200).json(response)
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
                await client.query('BEGIN')
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
                sale.products.forEach(async (product: {product_id: Number, quantity: Number}) => {
                    await client.query(`INSERT INTO sale_products (sale_id, product_id, quantity) VALUES ($1, $2, $3)`, [saleID.rows[0].id, product.product_id, product.quantity])
                })
                await client.query('COMMIT')

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
    const id = parseInt(req.params.id)
    await pool.query(sale_queries.sale_delete, [id])
    res.status(200).json({message:'Success'})
})

export const sale_update_post = [
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
        const id = parseInt(req.params.id)
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

            try {
                await client.query('BEGIN')
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

                await client.query(sale_queries.sale_update, [sale.date, sale.store.id, sale.staff, sale.payment_method, sale.customer.id, sale.total, id])
                await client.query('DELETE FROM sale_products WHERE sale_products.sale_id = $1', [id])
                sale.products.forEach(async (product: {product_id: Number, quantity: Number}) => {
                    await client.query(`INSERT INTO sale_products (sale_id, product_id, quantity) VALUES ($1, $2, $3)`, [id, product.product_id, product.quantity])
                })
                await client.query('COMMIT')
                res.status(200).json({message: 'Success'})
            } catch (err) {
                await client.query('ROLLBACK')
                res.status(400).json(err)
            } finally {
                client.release()
            }
        }
    })
]