export const get_all_customers = `SELECT 
                                    concat(first_name, ' ', last_name) as customer_name,
                                    concat(street, coalesce(', ' || city, ''), coalesce(', ' || state, ''), coalesce(' ' || zip, '')) as address,
                                    phone_number, 
                                    id as customer_id
                                    FROM customers
                                    LIMIT $1 OFFSET $2`
export const get_customers_count = `SELECT count(id) FROM customers`
export const customer_detail = `SELECT 
                                    first_name,
                                    last_name,
                                    coalesce(street, '') as street,
                                    coalesce(city, '') as city,
                                    coalesce(state, '') as state,
                                    coalesce(zip::text, '') as zip,
                                    phone_number, 
                                    id as customer_id
                                FROM customers 
                                WHERE id = $1`
export const customer_buy_detail = `SELECT
                                        sales.id as sale_name,
                                        products.name as product_name,
                                        products.price as xxxidxxx,
                                        sales.quantity,
                                        to_char(sales.sale_date, 'MM-DD-YYYY') as sale_date,
                                        stores.store_name as store_name,
                                        staffs.first_name || ' ' || staffs.last_name as staff_name,
                                        products.id as product_id,
                                        sales.id as sale_id
                                    FROM sales
                                        INNER JOIN products ON sales.item = products.id
                                        INNER JOIN stores ON sales.store = stores.id
                                        INNER JOIN staffs ON sales.staff = staffs.id
                                    WHERE sales.customer = $1`
export const customer_create = `INSERT INTO customers (
                                    first_name, 
                                    last_name,
                                    phone_number, 
                                    street, 
                                    city, 
                                    state, 
                                    zip) 
                                VALUES ($1, $2, $3, $4, $5, $6, $7)
                                RETURNING id`
export const customer_update = `UPDATE customers
                                SET first_name = $1,
                                    last_name = $2,
                                    street = $3,
                                    city = $4,
                                    state = $5,
                                    zip = $6,
                                    phone_number = $7
                                WHERE id = $8`
export const customer_delete = `DELETE FROM customers WHERE id = $1`