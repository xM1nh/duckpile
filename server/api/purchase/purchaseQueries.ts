export const get_all_purchases = 'SELECT * FROM purchases ORDER BY purchase_date DESC LIMIT $1 OFFSET $2'
export const purchase_detail = 'SELECT * FROM purchases WHERE id = $1'
export const purchase_create = 'INSERT INTO purchases (item, quantity, purchase_date, store, supplier, staff) values ($1, $2, $3, $4, $5, $6)'
export const purchase_update = ''