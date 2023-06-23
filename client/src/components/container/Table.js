import './_Table.css'
import { Link } from 'react-router-dom'

const Table = ({mainData, header_array, data_array}) => {
    const mainDataID = mainData.concat('_', 'id')

    const handleDelete = () => {

    }

    return (
        <table>
            <thead>
                <tr>
                    {header_array.map((header, i) => {
                        return (
                            <th key={i}>{header}</th>
                        )
                    })}
                    <th></th>
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
                                    if (key.includes('name')) {
                                        const param = key.split('_')[0]
                                        const objectID = param.concat('_', 'id')
                                        return (
                                            <td key={i}><Link to={`/${param}/${object[objectID]}`}>{object[key]}</Link></td>
                                        )
                                    }
                                    if (!key.includes('id')) return (
                                        <td key={i} id={object.id}>{object[key]}</td>
                                    )
                                })
                            }
                            <td style={{textAlign: 'center'}}>
                                <Link to={`/${mainData}/${object[mainDataID]}/edit`} className='edit' style={{marginRight: '15%'}}>Edit</Link>
                                <button id={object[mainDataID]} className='delete'>Delete</button>
                            </td>
                        </tr>
                    </tbody>
                )
            })}
        </table>
    )
}

export default Table