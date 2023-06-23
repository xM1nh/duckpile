export const get_all_suppliers = `SELECT 
                                    name as supplier_name,
                                    street || ', ' || city || ', ' || state as address,
                                    phone_number,
                                    suppliers.id as supplier_id
                                FROM suppliers`
export const sort = 'SELECT * FROM suppliers ORDER BY $1 $2'
export const supplier_detail = 'SELECT * FROM suppliers WHERE id = $1'
export const supplier_create = 'INSERT INTO suppliers (name, street, city, state, phone_number) values ($1, $2, $3, $4, $5)'
export const supplier_update = ''