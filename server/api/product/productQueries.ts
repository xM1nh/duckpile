export const get_all_products = `SELECT 
                                        images.file_paths[1] as image,
                                        products.name as product_name,
                                        products.type,
                                        products.brand,
                                        suppliers.name as supplier_name,
                                        products.sku,
                                        products.content,
                                        to_char(products.expired_date, 'MM-DD-YYYY') as expired_date,
                                        products.price,
                                        products.discount,
                                        coalesce(inventory_store_1, 0) as inventory_store_1,
                                        coalesce(inventory_store_2, 0) as inventory_store_2,
                                        coalesce(inventory_store_3, 0) as inventory_store_3,
                                        products.id as product_id,
                                        suppliers.id as supplier_id
                                    FROM products
                                        INNER JOIN suppliers ON products.supplier = suppliers.id
                                        LEFT JOIN images ON products.id = images.product_id
                                    ORDER BY products.name
                                    LIMIT $1 OFFSET $2`
export const get_product_count = 'SELECT count(id) FROM products'
export const sort_all_products = 'SELECT * FROM products ORDER BY $1 $2'
export const product_general_detail = `SELECT 
                                            products.name as product_name,
                                            products.type,
                                            products.brand,
                                            suppliers.name as supplier_name,
                                            products.sku,
                                            products.content,
                                            images.file_paths[0] as image,
                                            to_char(products.expired_date, 'YYYY-MM-DD') as expired_date,
                                            products.price,
                                            coalesce(products.discount, 0) as discount,
                                            coalesce(inventory_store_1, 0) as inventory_store_1,
                                            coalesce(inventory_store_2, 0) as inventory_store_2,
                                            coalesce(inventory_store_3, 0) as inventory_store_3,
                                            products.id as product_id,
                                            suppliers.id as supplier_id
                                        FROM products
                                            INNER JOIN suppliers ON products.supplier = suppliers.id
                                            LEFT JOIN images ON products.id = images.product_id 
                                        WHERE products.id=$1`
export const product_images = `SELECT
                                    file_paths
                                FROM images
                                WHERE product_id = $1`
export const product_sales_detail = `SELECT 
                                        sales.id as sale_name,
                                        to_char(sales.sale_date, 'YYYY-MM-DD') as sales_date,
                                        sales.quantity,
                                        customers.first_name || ' ' || customers.last_name as customer_name,
                                        sales.payment_method,
                                        stores.store_name as store_name,
                                        staffs.first_name || ' ' || staffs.last_name as staff,
                                        products.id as product_id,
                                        customers.id as customer_id,
                                        stores.id as store_id,
                                        sales.id as sale_id
                                    FROM sales
                                        INNER JOIN products ON sales.item = products.id
                                        INNER JOIN stores ON sales.store = stores.id
                                        INNER JOIN staffs ON sales.staff = staffs.id
                                        LEFT JOIN customers ON sales.customer = customers.id
                                    WHERE sales.item = $1
                                    ORDER BY sale_date DESC
                                    LIMIT 30`
export const product_purchase_detail = `SELECT
                                            purchases.id as purchase_name,
                                            to_char(purchases.purchase_date, 'YYYY-MM-DD') as purchases_date,
                                            purchases.quantity,
                                            stores.store_name as store_name,
                                            suppliers.name as supplier_name,
                                            staffs.first_name || ' ' || staffs.last_name as staff,
                                            stores.id as store_id,
                                            suppliers.id as supplier_id,
                                            purchases.id as purchase_id
                                        FROM purchases
                                            INNER JOIN products ON purchases.item = products.id
                                            INNER JOIN stores ON purchases.store = stores.id
                                            INNER JOIN staffs ON purchases.staff = staffs.id
                                            INNER JOIN suppliers ON purchases.supplier = suppliers.id
                                        WHERE purchases.item = $1
                                        ORDER BY purchase_date DESC
                                        LIMIT 30`
export const product_show_detail = `SELECT 
                                        show.name AS show,
                                        to_char(show.date, 'YYYY-MM-DD') as date,
                                        products.name as product_name,
                                        show.price,
                                        show.content,
                                        products.id as product_id
                                    FROM show
                                        INNER JOIN products ON show.item = products.id
                                    WHERE show.item = $1
                                    ORDER BY show.date DESC`
export const product_create = `INSERT INTO products (
                                    name, 
                                    type, 
                                    brand, 
                                    supplier, 
                                    sku, 
                                    content, 
                                    expired_date, 
                                    price, 
                                    discount,
                                    inventory_store_1,
                                    inventory_store_2,
                                    inventory_store_3) 
                                VALUES (
                                    $1, 
                                    $2, 
                                    $3, 
                                    $4, 
                                    NULLIF($5, '')::int, 
                                    $6, 
                                    NULLIF($7, '')::date, 
                                    $8, 
                                    NULLIF($9, '')::decimal,
                                    $10,
                                    $11,
                                    $12)
                                RETURNING id;`
export const product_update = `UPDATE products
                                SET name = $1,
                                    type = $2,
                                    brand = $3,
                                    supplier = $4,
                                    sku = $5,
                                    content = $6,
                                    expired_date = NULLIF($7, '')::date,
                                    price = $8,
                                    discount = $9,
                                    inventory_store_1 = $10,
                                    inventory_store_2 = $11,
                                    inventory_store_3 = $12
                                WHERE products.id = $13`
export const product_delete = `DELETE FROM products WHERE products.id = $1`