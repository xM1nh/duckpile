export const get_all_suppliers = `SELECT 
                                    name as supplier_name,
                                    street || ', ' || city || ', ' || state || ' ' || zip as address,
                                    phone_number,
                                    suppliers.id as supplier_id
                                FROM suppliers
                                LIMIT $1 OFFSET $2`
export const get_suppliers_count = `SELECT count(id) FROM suppliers`
export const supplier_detail = `SELECT 
                                    name,
                                    coalesce(street, '') as street,
                                    coalesce(city, '') as city,
                                    coalesce(state, '') as state,
                                    coalesce(zip::text, '') as zip,
                                    phone_number, 
                                    id as supplier_id
                                FROM suppliers 
                                WHERE id = $1`
export const supplier_purchase_detail = `SELECT
                                        purchases.id as purchase_name,
                                        ARRAY(SELECT concat(products.name, ',', purchase_products.quantity, ',', products.id)
                                                    FROM purchase_products
                                                        INNER JOIN products ON purchase_products.product_id = products.id
                                                    WHERE purchase_products.purchase_id = purchases.id) AS products,
                                        to_char(purchases.purchase_date, 'MM-DD-YYYY') as purchase_date,
                                        purchases.total_amount,
                                        stores.store_name as store_name,
                                        purchases.staff,
                                        purchases.id as purchase_id
                                    FROM purchases
                                        INNER JOIN stores ON purchases.store = stores.id
                                    WHERE purchases.supplier = $1`
export const supplier_most_purchase = `SELECT products.name, sum(purchase_products.quantity) as quantity
                                    FROM purchases
                                        INNER JOIN purchase_products ON purchases.id = purchase_products.purchase_id
                                        INNER JOIN products ON purchase_products.product_id = products.id
                                    WHERE purchases.supplier = $1
                                    GROUP BY products.name
                                    ORDER BY quantity DESC
                                    LIMIT 1;` 
export const supplier_create = `INSERT INTO suppliers (
                                    name, 
                                    phone_number, 
                                    street, 
                                    city, 
                                    state, 
                                    zip) 
                                VALUES ($1, $2, $3, $4, $5, $6)
                                RETURNING id`
export const supplier_update = `UPDATE suppliers
                                SET name = $1,
                                    street = $2,
                                    city = $3,
                                    state = $4,
                                    zip = $5,
                                    phone_number = $6
                                WHERE id = $7`
export const supplier_delete = `DELETE FROM suppliers WHERE id = $1`