import './_CustomerDetailPage.css'
import MainNavbar from '../../components/navbar/MainNavbar'
import Table from '../../components/container/Table'
import SummaryContainer from '../../components/container/SummaryContainer'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import useFetch from '../../hooks/useFetch'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const CustomerDetailPage = () => {
    const {id} = useParams()
    const [customerData, setCustomerData] = useState({
        name: '',
        address: '',
        phone_number: '',
    })
    const [customerSaleData, setCustomerSaleData] = useState({
        list: [],
        mostBuyedProduct: [],
        totalSales: '',
        totalValue: ''
    })

    const {isLoading, apiData, serverErr} = useFetch(`/api/v1/customers/customer/${id}`)
    
    useEffect(() => {
        if (apiData.general) {
            setCustomerData({
                name: apiData.general.first_name + ' ' + apiData.general.last_name,
                address: apiData.general.street + ', ' + apiData.general.city + ', ' + apiData.general.state + ' ' + apiData.general.zip,
                phone_number: apiData.general.phone_number
            })
        }
        if (apiData.sales) {
            setCustomerSaleData({
                list: apiData.sales.list,
                mostBuyedProduct: apiData.sales.mostBuyedProduct ? apiData.sales.mostBuyedProduct[0] : 'No Data',
                totalSales: apiData.sales.totalSales,
                totalValue: apiData.sales.totalValue
            })
        }
    }, [apiData.general, apiData.sales])

    return (
        <div className='page customer-detail'>
            <MainNavbar />

            <main>
                <div className='info'>
                    <div className='customer-name'>{customerData.name}</div>
                    <div className='customer-phone'>{customerData.phone_number}</div>
                    <div className='customer-address'>{customerData.address}</div>
                </div>
                <div className='customer-summary'>
                    <SummaryContainer text_to_show='Total Sales' data_to_show={customerSaleData.totalSales}/>
                    <SummaryContainer text_to_show='Total Value' data_to_show={'$' + customerSaleData.totalValue}/>
                    <SummaryContainer text_to_show='Most Buyed Product' data_to_show={customerSaleData.mostBuyedProduct}/>
                </div>
                <div className='sales'>
                    <div className='table-title sales'>All Sales</div>
                    <Table 
                    header_array={['Sale Code', 'Product', 'Quantity', 'Date', 'Location', 'Staff']}
                    data_array={customerSaleData.list}
                    mainData='sale'
                    />
                </div>

                <ButtonContainer 
                        create={true}
                        edit={true}
                        del={true}
                        createURL='/customer/create'
                        editURL={`/customer/${id}/edit`}
                    />
            </main>
        </div>
    )
}

export default CustomerDetailPage