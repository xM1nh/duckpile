export const get_all_images = 'SELECT * FROM images'
export const sort = 'SELECT * FROM images ORDER BY $1 $2'
export const image_detail = 'SELECT * FROM images WHERE id = $1'
export const image_create = `INSERT INTO images (
                                product_id,
                                file_paths)
                            VALUES ($1, $2)`
export const image_update = ''