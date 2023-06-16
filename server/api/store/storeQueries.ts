export const get_all_stores = 'SELECT * FROM stores'
export const sort = 'SELECT * FROM stores ORDER BY $1 $2'
export const store_detail = 'SELECT * FROM stores WHERE id = $1'
export const store_create = 'INSERT INTO stores (name, street, city, state, zip, phone_number) values ($1, $2, $3, $4, $5, $6)'
export const store_update = ''