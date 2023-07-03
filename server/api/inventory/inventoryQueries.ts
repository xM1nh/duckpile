export const get_all_inventory = `SELECT 
                                    products.name as product_name,
                                    coalesce(products.inventory_store_1, 0) as inventory_store_1,
                                    coalesce(products.inventory_store_2, 0) as inventory_store_2,
                                    coalesce(products.inventory_store_3, 0) as inventory_store_3,
                                    products.id as product_id 
                                FROM products 
                                ORDER BY products.id DESC`
export const sort = 'SELECT * FROM inventory ORDER BY $1 $2'
export const inventory_detail = 'SELECT * FROM inventory WHERE id = $1'
export const inventory_create = 'INSERT INTO inventory (store, item, quantity) values ($1, $2, $3)'
export const inventory_update = ''