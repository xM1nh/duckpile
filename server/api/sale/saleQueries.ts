export const get_all_sales = `SELECT 
                                    sales.id as sale_name,
                                    to_char(sales.sale_date, 'MM-DD-YYYY'),
                                    array(select concat(products.name,',',sale_products.quantity)
                                        from sale_products
                                            inner join products on sale_products.product_id = products.id
                                        where sale_products.sale_id = sales.id) as products,
                                    sales.total_amount as total_price,
                                    payment_method,
                                    concat(customers.first_name, ' ', customers.last_name) as customer_name,
                                    stores.store_name as store_name,
                                    sales.staff,
                                    customers.id as customer_id,
                                    stores.id as store_id,
                                    sales.id as sale_id
                                FROM sales
                                    INNER JOIN stores ON sales.store = stores.id
                                    LEFT JOIN customers ON sales.customer = customers.id
                                    
                                ORDER BY sales.sale_date DESC
                                LIMIT $1 OFFSET $2`
export const get_sale_count = `SELECT count(id) FROM sales`
export const get_most_buyed_product = `SELECT 
                                            products.name, 
                                            sum(sale_products.quantity) as quantity
                                        FROM sale_products
                                            INNER JOIN products ON sale_products.product_id = products.id
                                        GROUP BY products.name
                                        ORDER BY quantity DESC
                                        LIMIT 1`
export const get_most_buyed_customer = `SELECT
                                            concat(customers.first_name, ' ', customers.last_name) as customer_name,
                                            count(*)
                                        FROM sales
                                            INNER JOIN customers ON sales.customer = customers.id
                                        GROUP BY customer_name
                                        ORDER BY count DESC
                                        LIMIT 1`
export const sale_detail = 'SELECT * FROM sales WHERE id = $1'
export const sale_create = `INSERT INTO sales (
                                sale_date, 
                                store, 
                                staff, 
                                payment_method, 
                                customer,
                                total_amount
                            ) 
                            values (
                                $1::date, 
                                $2, 
                                $3, 
                                $4::payment_type, 
                                $5::int,
                                $6
                                ) 
                            RETURNING sales.id`
export const sale_update = ''