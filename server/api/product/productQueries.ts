export const get_all_products = `SELECT 
                                    products.name,
                                    products.type,
                                    products.brand,
                                    suppliers.name as supplier,
                                    products.sku,
                                    products.content,
                                    products.images,
                                    products.expired_date,
                                    products.price,
                                    products.discount,
                                    products.id
                                FROM products
                                    INNER JOIN suppliers ON products.supplier = suppliers.id`
export const get_product_count = 'SELECT count(*) FROM products'
export const get_paginated_products = `SELECT 
                                        products.name,
                                        products.type,
                                        products.brand,
                                        suppliers.name as supplier,
                                        products.sku,
                                        products.content,
                                        products.images,
                                        products.expired_date,
                                        products.price,
                                        products.discount,
                                        products.id
                                    FROM products
                                        INNER JOIN suppliers ON products.supplier = suppliers.id 
                                    LIMIT $1 OFFSET $2`
export const sort_all_products = 'SELECT * FROM products ORDER BY $1 $2'
export const product_general_detail = `SELECT 
                                            products.name,
                                            products.type,
                                            products.brand,
                                            suppliers.name as supplier,
                                            products.sku,
                                            products.content,
                                            products.images,
                                            products.expired_date,
                                            products.price,
                                            products.discount,
                                            products.id
                                        FROM products
                                            INNER JOIN suppliers ON products.supplier = suppliers.id 
                                        WHERE products.id=$1`
export const product_sales_detail = `SELECT 
                                        sales.sale_date,
                                        sales.quantity,
                                        customers.first_name || ' ' || customers.last_name as customers,
                                        sales.payment_method,
                                        stores.store_name,
                                        staffs.first_name || ' ' || staffs.last_name as staff,
                                        products.id as id
                                    FROM sales
                                        INNER JOIN products ON sales.item = products.id
                                        INNER JOIN stores ON sales.store = stores.id
                                        INNER JOIN staffs ON sales.staff = staffs.id
                                        LEFT JOIN customers ON sales.customer = customers.id
                                    WHERE sales.item = $1
                                    ORDER BY sale_date DESC`
export const product_purchase_detail = `SELECT 
                                            purchases.purchase_date,
                                            purchases.quantity,
                                            stores.store_name,
                                            suppliers.name,
                                            staffs.first_name || ' ' || staffs.last_name as staff
                                        FROM purchases
                                            INNER JOIN products ON purchases.item = products.id
                                            INNER JOIN stores ON purchases.store = stores.id
                                            INNER JOIN staffs ON purchases.staff = staffs.id
                                            INNER JOIN suppliers ON purchases.supplier = suppliers.id
                                        WHERE purchases.item = $1
                                        ORDER BY purchase_date DESC`
export const product_create = 'INSERT INTO products (name, type, brand, supplier, sku, content, images, expired_date, price, discount) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
export const product_update = ''