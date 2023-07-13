export const get_all_purchases = `SELECT 
                                    purchases.id as purchase_name,
                                    to_char(purchases.purchase_date, 'MM-DD-YYYY'),
                                    array(select concat(products.name,',',purchase_products.quantity)
                                        from purchase_products
                                            inner join products on purchase_products.product_id = products.id
                                        where purchase_products.purchase_id = purchases.id) as products,
                                    purchases.total_amount as total_price,
                                    suppliers.name as supplier_name,
                                    stores.store_name as store_name,
                                    purchases.staff,
                                    suppliers.id as supplier_id,
                                    stores.id as store_id,
                                    purchases.id as purchase_id
                                    FROM purchases
                                    INNER JOIN stores ON purchases.store = stores.id
                                    LEFT JOIN suppliers ON purchases.supplier = suppliers.id

                                    ORDER BY purchases.purchase_date DESC
                                    LIMIT $1 OFFSET $2`
export const get_purchase_count = `SELECT count(id) FROM purchases`
export const get_most_purchased_product = `SELECT 
                                    products.name, 
                                    sum(purchase_products.quantity) as quantity
                                FROM purchase_products
                                    INNER JOIN products ON purchase_products.product_id = products.id
                                GROUP BY products.name
                                ORDER BY quantity DESC
                                LIMIT 1`
export const get_most_purchased_supplier = `SELECT
                                    suppliers.name as supplier_name,
                                    count(*)
                                FROM purchases
                                    INNER JOIN suppliers ON purchases.supplier = suppliers.id
                                GROUP BY supplier_name
                                ORDER BY count DESC
                                LIMIT 1`
export const purchase_detail = `SELECT 
                                    purchases.id as purchase_name,
                                    to_char(purchases.purchase_date, 'MM-DD-YYYY') as purchase_date,
                                    ARRAY(SELECT concat(products.name, ',', purchase_products.quantity, ',', products.price, ',', products.id)
                                            FROM purchase_products
                                                INNER JOIN products ON purchase_products.product_id = products.id
                                            WHERE purchase_products.purchase_id = purchases.id) AS products,
                                    purchases.total_amount,
                                    suppliers.name,
                                    suppliers.phone_number,
                                    suppliers.street,
                                    suppliers.city,
                                    suppliers.state,
                                    suppliers.zip,
                                    purchases.staff,
                                    stores.store_name,
                                    stores.id as store_id,
                                    suppliers.id as supplier_id
                                    FROM purchases
                                    INNER JOIN stores ON purchases.store = stores.id
                                    LEFT JOIN suppliers ON purchases.supplier = suppliers.id
                                    WHERE purchases.id = $1;`
export const purchase_create = `INSERT INTO purchases (
                                    purchase_date, 
                                    store, 
                                    staff,  
                                    supplier,
                                    total_amount
                                ) 
                                values (
                                    $1::date, 
                                    $2, 
                                    $3,  
                                    $4::int,
                                    $5
                                    ) 
                                RETURNING purchases.id`
export const purchase_update = `UPDATE purchases
                                SET purchase_date = $1, 
                                    store = $2, 
                                    staff = $3,  
                                    supplier = $4,
                                    total_amount = $5
                                WHERE purchases.id = $6`