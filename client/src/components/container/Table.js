import './_Table.css'
import { Link } from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'

const Table = ({mainData, header_array, data_array, handleDelete}) => {
    const mainDataID = mainData ? mainData.concat('_', 'id') : null

    return (
        <table>
            <thead>
                <tr>
                    {header_array.map((header, i) => {
                        return (
                            <th key={uuidv4()}>{header}</th>
                        )
                    })}
                    <th className='table-buttons'></th>
                </tr>
            </thead>
            {data_array.map((object, i) => {
                let bg_color
                if (i % 2 === 0) bg_color = '#f2f2f2'
                else bg_color = 'd6d6d6'
                return (
                    <tbody key={uuidv4()}>
                        <tr key={uuidv4()} style={{backgroundColor: bg_color}}>
                            {
                                Object.keys(object).map((key, i) => {
                                    if (key.includes('name')) {
                                        const param = key.split('_')[0]
                                        const objectID = param.concat('_', 'id')
                                        return (
                                            <td key={uuidv4()}><Link to={`/${param}/${object[objectID]}`}>{object[key]}</Link></td>
                                        )
                                    }
                                    if (key.includes('image') && object[key]) {
                                        return (
                                            <td key={uuidv4()} id={object.id}><img src={[object[key]]} alt='productImg'></img></td>
                                        )
                                    }
                                    if (key.includes('price')) return (
                                        <td key={uuidv4()} id={object.id}>{'$' + object[key]}</td>
                                    )
                                    if (!key.includes('id')) return (
                                        <td key={uuidv4()} id={object.id}>{object[key]}</td>
                                    )
                                })
                            }
                            <td style={{textAlign: 'center'}} className='table-buttons'>
                                <Link to={`/${mainData}/${object[mainDataID]}/edit`} className='edit' style={{marginRight: '15%'}}>Edit</Link>
                                <button id={object[mainDataID]} className='delete' onClick={handleDelete} type='button'>Delete</button>
                            </td>
                        </tr>
                    </tbody>
                )
            })}
        </table>
    )
}

export default Table