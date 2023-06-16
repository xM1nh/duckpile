export const get_all_products = 'SELECT * FROM products'
export const sort = 'SELECT * FROM products ORDER BY $1 $2'
export const product_detail = 'SELECT * FROM products WHERE id = $1'
export const product_create = 'INSERT INTO products (name, type, brand, supplier, sku, content, images, expired_date, price, discount) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
export const product_update = ''