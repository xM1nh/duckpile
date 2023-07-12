import './_InventoryPage.css'
import MainNavbar from '../../components/navbar/MainNavbar'
import SummaryContainner from '../../components/container/SummaryContainer'
import Spinner from '../../components/spinner/Spinner'
import Table from '../../components/container/Table'
import useFetch from '../../hooks/useFetch'
import { useEffect, useState } from 'react'

const InventoryPage = () => {
    const {isLoading, apiData, serverErr} = useFetch('/api/v1/inventory')
    const [store1, setStore1] = useState({
        availProduct: 0,
        inventory: []
    })
    const [store2, setStore2] = useState({
        availProduct: 0,
        inventory: []
    })
    const [store3, setStore3] = useState({
        availProduct: 0,
        inventory: []
    })

    useEffect(() => {
        if (apiData) {
            const availProduct1 = apiData.store1.filter(product => product.quantity).length
            setStore1({
                availProduct: availProduct1,
                inventory: apiData.store1
            })
            const availProduct2 = apiData.store2.filter(product => product.quantity).length
            setStore2({
                availProduct: availProduct2,
                inventory: apiData.store2
            })
            const availProduct3 = apiData.store3.filter(product => product.quantity).length
            setStore3({
                availProduct: availProduct3,
                inventory: apiData.store3
            })
        }

    }, [apiData])

    return (
        <div className='page inventory'>
            <MainNavbar />
            
            <main>
                <div className='inventory-summary'>
                    <SummaryContainner data_to_show={store1.availProduct} text_to_show='Available Products'/>
                    <SummaryContainner data_to_show={store2.availProduct} text_to_show='Available Products'/>
                    <SummaryContainner data_to_show={store3.availProduct} text_to_show='Available Products'/>
                </div>
                <div className='inventory-detail'>
                    <div>
                        <h2>Store 1</h2>
                        <Table 
                            header_array={['Product', 'Quantity']} 
                            data_array={apiData ? apiData.store1 : []} 
                            mainData='product'/>
                    </div>
                    <div>
                        <h2>Store 2</h2>
                        <Table 
                            header_array={['Product', 'Quantity']} 
                            data_array={apiData ? apiData.store2 : []}
                            mainData='product' />
                    </div>
                    <div>
                        <h2>Store 3</h2>
                        <Table 
                            header_array={['Product', 'Quantity']} 
                            data_array={apiData ? apiData.store3 : []} 
                            mainData='product'/>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default InventoryPage