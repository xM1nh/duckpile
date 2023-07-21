import './_InventoryPage.css'
import MainNavbar from '../../components/navbar/MainNavbar'
import SummaryContainner from '../../components/container/SummaryContainer'
import Spinner from '../../components/spinner/Spinner'
import Table from '../../components/container/Table'
import { useEffect, useState } from 'react'

import { useGetInventoryQuery } from '../../features/inventory/inventoryApiSlice'

const InventoryPage = () => {
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetInventoryQuery()

    console.log(data)

    let content

    if (isSuccess) {
        content = 
            <main>
                <div className='inventory-summary'>
                    <SummaryContainner data_to_show={data.store1.availProducts} text_to_show='Available Products'/>
                    <SummaryContainner data_to_show={data.store2.availProducts} text_to_show='Available Products'/>
                    <SummaryContainner data_to_show={data.store3.availProducts} text_to_show='Available Products'/>
                </div>
                <div className='inventory-detail'>
                    <div>
                        <h2>Store 1</h2>
                            <Table 
                                header_array={['Product', 'Quantity']} 
                                data_array={data.store1.inventory} 
                                mainData='product'/>
                    </div>
                    <div>
                        <h2>Store 2</h2>
                            <Table 
                                header_array={['Product', 'Quantity']} 
                                data_array={data.store2.inventory} 
                                mainData='product'/>
                    </div>
                    <div>
                        <h2>Store 3</h2>
                            <Table 
                                header_array={['Product', 'Quantity']} 
                                data_array={data.store3.inventory} 
                                mainData='product'/>
                    </div>
                </div>
            </main>
    }

    return (
        <div className='page inventory'>
            <MainNavbar />
            {content}
        </div>
    )
}

export default InventoryPage