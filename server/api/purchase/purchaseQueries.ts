export const get_all_purchases = `SELECT 
                                    purchases.id as purchase_name,
                                    to_char(purchases.purchase_date, 'MM-DD-YYYY') as purchase_date,
                                    products.name as product_name,
                                    purchases.quantity,
                                    stores.store_name as store_name,
                                    suppliers.name as supplier_name,
                                    staffs.first_name || ' ' || staffs.last_name as staff,
                                    products.id as product_id,
                                    stores.id as store_id,
                                    suppliers.id as supplier_id,
                                    purchases.id as purchase_id
                                FROM purchases
                                    INNER JOIN products ON purchases.item = products.id
                                    INNER JOIN stores ON purchases.store = stores.id
                                    INNER JOIN suppliers ON purchases.supplier = suppliers.id
                                    INNER JOIN staffs ON purchases.staff = staffs.id

                                    ORDER BY purchase_date DESC 
                                    LIMIT $1 OFFSET $2`
export const purchase_detail = 'SELECT * FROM purchases WHERE id = $1'
export const purchase_create = 'INSERT INTO purchases (item, quantity, purchase_date, store, supplier, staff) values ($1, $2, $3, $4, $5, $6)'
export const purchase_update = ''