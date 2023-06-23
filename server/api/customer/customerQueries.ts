export const get_all_customers = `SELECT first_name || ' ' || last_name as customer_name,
                                    street || ', ' || city || ', ' || state as address,
                                    phone_number, 
                                    id as customer_id
                                    FROM customers`
export const sort = 'SELECT * FROM customers ORDER BY $1 $2'
export const customer_detail = 'SELECT * FROM customers WHERE id = $1'
export const customer_create = 'INSERT INTO customers (first_name, last_name, street, city, state, phone_number) values ($1, $2, $3, $4, $5, $6)'
export const customer_update = ''