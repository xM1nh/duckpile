import pool from '../../database'
import * as purchase_queries from './purchaseQueries'
import {get_all_suppliers, supplier_create, supplier_update} from '../supplier/supplierQueries'
import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'

export const purchase_list = asyncHandler(async (req, res, next) => {
    const pagination = {
        limit: req.query.count,
        offset: (Number(req.query.page) - 1) * Number(req.query.count)
    }
    const purchases = await pool.query(purchase_queries.get_all_purchases, [pagination.limit, pagination.offset])
    const purchasesCount = await pool.query(purchase_queries.get_purchase_count)
    const most_purchased_product = await pool.query(purchase_queries.get_most_purchased_product)
    const most_purchased_supplier = await pool.query(purchase_queries.get_most_purchased_supplier)

    const response = purchases.rows.map((row: {products: string[]}) => {
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
    res.status(200).json({summary: response, count: purchasesCount.rows[0].count, mostPurchasedProduct: most_purchased_product.rows[0].name, mostPurchasedSupplier: most_purchased_supplier.rows[0].supplier_name})
})

export const purchase_detail = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id)
    const purchase = await pool.query(purchase_queries.purchase_detail, [id])

    const response = {
        supplier: {
            name: purchase.rows[0].name,
            address: purchase.rows[0].street.concat(', ', purchase.rows[0].city, ', ', purchase.rows[0].state, ' ', purchase.rows[0].zip),
            phone: purchase.rows[0].phone_number
        },
        purchase: {
            products: purchase.rows[0].products.map((product: string) => {
                const product_name = product.split(',')[0]
                const quantity = product.split(',')[1]
                const product_id = product.split(',')[2]
                return ({product_name, quantity, product_id})
            }),
            totalAmount: purchase.rows[0].total_amount,
        },
        date: purchase.rows[0].purchase_date,
        store: purchase.rows[0].store_name,
        staff: purchase.rows[0].staff
    }

    res.status(200).json(response)
})

export const purchase_create_get = asyncHandler(async (req, res, next) => {
    const products = await pool.query('SELECT products.name, products.price, products.id FROM products')
    const suppliers = await pool.query(get_all_suppliers, [null, null])
    const stores = await pool.query('SELECT stores.store_name as name, stores.id FROM stores')
    res.status(200).json({products: products.rows, suppliers: suppliers.rows, stores: stores.rows})
})

export const purchase_create_post = [
    body('supplier_name')
        .trim()
        .escape(),
    body('supplier_phone')
        .trim()
        .escape(),
    body('supplier_street')
        .trim()
        .escape(),  
    body('supplier_city')
        .trim()
        .escape(), 
    body('supplier_state')
        .trim()
        .escape(), 
    body('supplier_zip')
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
    body('supplier_id')
        .toInt(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const purchase = {
            supplier: {
                id: req.body.supplier_id ? req.body.supplier_id : null,
                name: req.body.supplier_name ? req.body.supplier_name : null,
                phone_number: req.body.supplier_phone ? parseInt(req.body.supplier_phone) : null,
                street: req.body.supplier_street ? req.body.supplier_street : null,
                city: req.body.supplier_city ? req.body.supplier_city : null,
                state: req.body.supplier_state ? req.body.supplier_state : null,
                zip: req.body.supplier_zip ? parseInt(req.body.supplier_zip) : null
            },
            products: JSON.parse(req.body.products),
            staff: req.body.staff,
            store: {
                name: req.body.store_name,
                id: req.body.store_id
            },
            date: req.body.date,
            total: req.body.total
        }

        if (!errors.isEmpty()) {
            res.status(400).json(errors)
        } else {
            const client = await pool.connect()
            let message = ''

            try {
                if (!purchase.supplier.id) {
                    if (purchase.supplier.phone_number) {
                        const supplier = await client.query(supplier_create, [
                            purchase.supplier.name,
                            purchase.supplier.phone_number,
                            purchase.supplier.street,
                            purchase.supplier.city,
                            purchase.supplier.state,
                            purchase.supplier.zip
                        ])
                        purchase.supplier.id = supplier.rows[0].id
                        message = 'Successfully created supplier'
                    }
                } else {
                    await client.query(supplier_update, [
                        purchase.supplier.name,
                        purchase.supplier.street,
                        purchase.supplier.city,
                        purchase.supplier.state,
                        purchase.supplier.zip,
                        purchase.supplier.phone_number,
                        purchase.supplier.id
                    ])
                    message = 'Successfully updated supplier information'
                }
                const purchaseID = await client.query(purchase_queries.purchase_create, [purchase.date, purchase.store.id, purchase.staff, purchase.supplier.id, purchase.total])
                purchase.products.forEach(async (product: {id: Number, quantity: Number}) => {
                    await client.query(`INSERT INTO purchase_products (purchase_id, product_id, quantity) VALUES ($1, $2, $3)`, [purchaseID.rows[0].id, product.id, product.quantity])
                })
                res.status(200).json({id: purchaseID.rows[0].id, message: message})
            } catch (err) {
                await client.query('ROLLBACK')
                res.status(400).json(err)
            } finally {
                client.release()
            }
        }
    })
]

export const purchase_delete_post = asyncHandler(async (req, res, next) => {
    res.send('not implemented: purchase delete post')
})

export const purchase_update_get = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id)
    const purchase = await pool.query(purchase_queries.purchase_detail, [id])
    const products = await pool.query('SELECT products.name, products.price, products.id FROM products')
    const suppliers = await pool.query(get_all_suppliers, [null, null])
    const stores = await pool.query('SELECT stores.store_name as name, stores.id FROM stores')

    const response = {
        purchase: {
            date: new Date(purchase.rows[0].purchase_date).toISOString().slice(0, 10),
            totalAmount: purchase.rows[0].total_amount,
            supplier: {
                name: purchase.rows[0].name,
                phone: purchase.rows[0].phone_number,
                street: purchase.rows[0].street,
                city: purchase.rows[0].city,
                state: purchase.rows[0].state,
                zip: purchase.rows[0].zip,
                id: purchase.rows[0].supplier_id
            },
            products: purchase.rows[0].products.map((product: string) => {
                const product_name = product.split(',')[0]
                const quantity = parseInt(product.split(',')[1])
                const product_price = Number(product.split(',')[2])
                const product_id = parseInt(product.split(',')[3])
                return ({product_name, product_price, quantity, product_id})
            }),
            staff: purchase.rows[0].staff,
            store: {
                name: purchase.rows[0].store_name,
                id: purchase.rows[0].store_id
            }
        },
        products: products.rows,
        suppliers: suppliers.rows,
        stores: stores.rows
    }

    res.status(200).json(response)
})

export const purchase_update_post = [
    body('supplier_name')
        .trim()
        .escape(),
    body('supplier_phone')
        .trim()
        .escape(),
    body('supplier_street')
        .trim()
        .escape(),  
    body('supplier_city')
        .trim()
        .escape(), 
    body('supplier_state')
        .trim()
        .escape(), 
    body('supplier_zip')
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
    body('supplier_id')
        .toInt(),

    asyncHandler(async (req, res, next) => {
        const id = parseInt(req.params.id)
        console.log(req.body.products)
        const errors = validationResult(req)

        const purchase = {
            supplier: {
                id: req.body.supplier_id ? req.body.supplier_id : null,
                name: req.body.supplier_name ? req.body.supplier_name : null,
                phone_number: req.body.supplier_phone ? parseInt(req.body.supplier_phone) : null,
                street: req.body.supplier_street ? req.body.supplier_street : null,
                city: req.body.supplier_city ? req.body.supplier_city : null,
                state: req.body.supplier_state ? req.body.supplier_state : null,
                zip: req.body.supplier_zip ? parseInt(req.body.supplier_zip) : null
            },
            products: JSON.parse(req.body.products),
            staff: req.body.staff,
            store: {
                name: req.body.store_name,
                id: req.body.store_id
            },
            date: req.body.date,
            total: req.body.total
        }

        console.log (purchase)
        if (!errors.isEmpty()) {
            res.status(400).json(errors)
        } else {
            const client = await pool.connect()

            try {
                await client.query(supplier_update, [
                    purchase.supplier.name,
                    purchase.supplier.street,
                    purchase.supplier.city,
                    purchase.supplier.state,
                    purchase.supplier.zip,
                    purchase.supplier.phone_number,
                    purchase.supplier.id
                ])

                await client.query(purchase_queries.purchase_update, [purchase.date, purchase.store.id, purchase.staff, purchase.supplier.id, purchase.total, id])
                await client.query('DELETE FROM purchase_products WHERE purchase_products.purchase_id = $1', [id])
                purchase.products.forEach(async (product: {id: Number, quantity: Number}) => {
                    await client.query(`INSERT INTO purchase_products (purchase_id, product_id, quantity) VALUES ($1, $2, $3)`, [id, product.id, product.quantity])
                })

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