export const get_all_show = `SELECT
                                show.name,
                                show.date,
                                products.name,
                                show.price,
                                show.content
                            FROM show
                                INNER JOIN products ON show.item = products.id
                            ORDER BY show.date DESC`