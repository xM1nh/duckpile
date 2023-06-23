export const get_all_inventory = `SELECT 
                                    products.id as product_id, 
                                    stores.store_name as store_name, 
                                    products.name as product_name, 
                                    SUM (inventory.quantity),
                                    stores.id as store_id  
                                FROM inventory 
                                    JOIN products ON inventory.item = products.id 
                                    JOIN stores ON inventory.store = stores.id
                                GROUP BY products.id, stores.store_name, stores.id
                                ORDER BY products.id DESC`
export const sort = 'SELECT * FROM inventory ORDER BY $1 $2'
export const inventory_detail = 'SELECT * FROM inventory WHERE id = $1'
export const inventory_create = 'INSERT INTO inventory (store, item, quantity) values ($1, $2, $3)'
export const inventory_update = ''