export const get_all_sales = 'SELECT * FROM sales'
export const sort = 'SELECT * FROM sales ORDER BY $1 $2'
export const sale_detail = 'SELECT * FROM sales WHERE id = $1'
export const sale_create = 'INSERT INTO sales (item, quantity, sale_date, store, staff, payment_method, customer) values ($1, $2, $3, $4, $5, $6, $7)'
export const sale_update = ''