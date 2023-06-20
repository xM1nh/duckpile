import './_Table.css'
import { Link } from 'react-router-dom'

const Table = ({param, header_array, data_array}) => {
    return (
        <table>
            <thead>
                <tr>
                    {header_array.map((header, i) => {
                        return (
                            <th key={i}>{header}</th>
                        )
                    })}
                </tr>
            </thead>
            {data_array.map((object, i) => {
                let bg_color
                if (i % 2 === 0) bg_color = '#f2f2f2'
                else bg_color = 'd6d6d6'
                return (
                    <tbody>
                        <tr key={i} style={{backgroundColor: bg_color}}>
                            {
                                Object.keys(object).map((key, i) => {
                                    if (key === 'name') return (
                                        <td key={i}><Link to={`/product/${object.id}`}>{object[key]}</Link></td>
                                    )
                                     if (key !== 'id') return (
                                        <td key={i} id={object.id}>{object[key]}</td>
                                    )
                                })
                            }
                        </tr>
                    </tbody>
                )
            })}
        </table>
    )
}

export default Table