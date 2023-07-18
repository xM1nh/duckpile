import pool from '../../config/dbConfig'
import * as supplier_queries from './supplierQueries'
import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'

export const supplier_list = asyncHandler(async (req, res, next) => {
    const pagination = {
        limit: Number(req.query.count),
        offset: (Number(req.query.page) - 1) * Number(req.query.count)
    }
    const suppliers = await pool.query(supplier_queries.get_all_suppliers, [pagination.limit, pagination.offset])
    const suppliersCount = await pool.query(supplier_queries.get_suppliers_count)
    res.status(200).json({suppliers: suppliers.rows, count: suppliersCount.rows[0].count})
})

export const supplier_detail = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id)
    const supplier = await pool.query(supplier_queries.supplier_detail, [id])
    const sales = await pool.query(supplier_queries.supplier_purchase_detail, [id])
    const mostPurchasedProduct = await pool.query(supplier_queries.supplier_most_purchase, [id])
    const totalSales = sales.rows.length
    const totalValue = sales.rows.reduce((sum: number, curr: {total_amount: number}) => {
        return sum + curr.total_amount
    }, 0)

    const response = {
        general: supplier.rows[0],
        sales: {
            list: sales.rows.map((row: {products: string[]}) => {
                var {products, ...rest} = row
                let result: string = ''
                row.products.forEach(product => {
                    const name = product.split(',')[0]
                    const quantity = product.split(',')[1]
                    const value = quantity + 'x' + ' ' + name + ', '
                    result += value
                })
                return {result, ...rest}
            }),
            totalSales: totalSales,
            totalValue: totalValue,
            mostPurchasedProduct: mostPurchasedProduct.rows[0]
        }
    }

    res.status(200).json(response)
})

export const supplier_create_post = [
    body('name', 'Name must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('phoneNumber')
        .trim()
        .isLength({min: 10, max: 10})
        .escape()
        .toInt(),
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
        .escape()
        .toInt(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const supplier = {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            street: req.body.street === '' ? null : req.body.street,
            city: req.body.city === '' ? null : req.body.city,
            state: req.body.state === '' ? null : req.body.state,
            zip: req.body.zip === '' ? null : req.body.zip,
        }

        if (!errors.isEmpty()) {
            res.status(400).json(errors)
        } else {
            const createCustomer = await pool.query(supplier_queries.supplier_create, [supplier.name, supplier.phoneNumber, supplier.street, supplier.city, supplier.state, supplier.zip])
            const supplierID = createCustomer.rows[0].id

            res.status(200).json({message: 'Success', id: supplierID})
        }
    })
]

export const supplier_delete_post = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id)
    await pool.query(supplier_queries.supplier_delete, [id])
    res.status(200).json({message: 'Deleted'})
})

export const supplier_update_get = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id)
    const supplier = await pool.query(supplier_queries.supplier_detail, [id])
    res.status(200).json(supplier.rows[0])
})

export const supplier_update_post = [
    body('name', 'Name must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('phone_number')
        .trim()
        .isLength({min: 10, max: 10})
        .escape()
        .toInt(),
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
        .escape()
        .toInt(),

    asyncHandler(async (req, res, next) => {
        const id = parseInt(req.params.id)
        const errors = validationResult(req)

        const supplier = {
            name: req.body.name,
            phoneNumber: req.body.phone_number,
            street: req.body.street === '' ? null : req.body.street,
            city: req.body.city === '' ? null : req.body.city,
            state: req.body.state === '' ? null : req.body.state,
            zip: req.body.zip === '' ? null : req.body.zip,
        }

        if (!errors.isEmpty()) {
            res.status(400).json(errors)
        } else {
            await pool.query(supplier_queries.supplier_update, [supplier.name, supplier.street, supplier.city, supplier.state, supplier.zip, supplier.phoneNumber, id])
            res.status(200).json({message: 'Updated'})
        }
    })
]