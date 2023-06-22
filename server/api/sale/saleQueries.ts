export const get_all_sales = `SELECT 
                                sales.sale_date, 
                                products.name, 
                                sales.quantity, 
                                customers.first_name || ' ' || customers.last_name as customer, 
                                stores.store_name, 
                                staffs.first_name || ' ' || staffs.last_name as staff,
                                products.id as id 
                            FROM sales
                                INNER JOIN products ON sales.item = products.id
                                INNER JOIN stores ON sales.store = stores.id
                                INNER JOIN staffs ON sales.staff = staffs.id
                                LEFT JOIN customers ON sales.customer = customers.id
                                
                                ORDER BY sales.sale_date DESC
                                LIMIT $1 OFFSET $2`
export const sale_detail = 'SELECT * FROM sales WHERE id = $1'
export const sale_create = 'INSERT INTO sales (item, quantity, sale_date, store, staff, payment_method, customer) values ($1, $2, $3, $4, $5, $6, $7)'
export const sale_update = ''