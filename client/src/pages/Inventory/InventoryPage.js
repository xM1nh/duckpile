import './_InventoryPage.css'
import MainNavbar from '../../components/navbar/MainNavbar'
import SummaryContainner from '../../components/container/SummaryContainer'
import Spinner from '../../components/spinner/Spinner'
import Table from '../../components/container/Table'
import useFetch from '../../hooks/useFetch'

const InventoryPage = () => {
    const {isLoading, apiData, serverErr} = useFetch('/api/v1/inventory')

    if (apiData !== undefined){
        const store1 = apiData.filter(object => object.store_name === 'Store 1')
        const store2 = apiData.filter(object => object.store_name === 'Store 2')
        const store3 = apiData.filter(object => object.store_name === 'Store 3')
        return (
            <div className='page inventory'>
                <MainNavbar />
                
                <main>
                    <div className='inventory-summary'>
                        <SummaryContainner />
                        <SummaryContainner />
                        <SummaryContainner />
                    </div>
                    <div className='inventory-detail'>
                        <div>
                            <Table 
                                header_array={['Store', 'Item', 'Quantity']} 
                                data_array={store1} 
                                mainData='inventory'/>
                        </div>
                        <div>
                            <Table 
                                header_array={['Store', 'Item', 'Quantity']} 
                                data_array={store2}
                                mainData='inventory' />
                        </div>
                        <div>
                            <Table 
                                header_array={['Store', 'Item', 'Quantity']} 
                                data_array={store3} 
                                mainData='inventory'/>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

export default InventoryPage