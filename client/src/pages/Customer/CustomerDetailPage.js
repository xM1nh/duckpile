import './_CustomerDetailPage.css'

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useGetCustomerQuery, useDeleteCustomerMutation } from '../../features/customers/customersApiSlice'
import { selectSalesFromCustomerId, useGetSalesQuery } from '../../features/sales/salesApiSlice'
import { useSelector } from 'react-redux'

import MainNavbar from '../../components/navbar/MainNavbar'
import Table from '../../components/container/Table'
import SummaryContainer from '../../components/container/SummaryContainer'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import Spinner from '../../components/spinner/Spinner'


const CustomerDetailPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)

    const {
        data: customer,
        isLoading: customerIsLoading,
        isSuccess,
        isError,
        error
    } = useGetCustomerQuery(id)

    const {
        data,
    } = useGetSalesQuery({page: 1, count: 200})

    const recentSales = useSelector(state => 
        selectSalesFromCustomerId(state, parseInt(id))
        ).map(sale => {
            const {products, customer_name, ...rest} = sale
            let result = ''
            sale.products.forEach(product => {
                result += product.quantity.toString().concat('x ', product.product_name, ', ')
            })
            return {result, ...rest}
        })

    const [deleteCustomer, {isLoading}] = useDeleteCustomerMutation()

    const openModal = () => {
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleDelete = async () => {
        try {
            await deleteCustomer(id)
            setModalOpen(false)
            navigate(-1)
        } catch (err) {
            console.error(err)
        }
    }

    let content

    if (customerIsLoading) content = <Spinner />
    if (isSuccess) {
        const name = customer.general.first_name + ' ' + customer.general.last_name
        const address = customer.general.street + ', ' + customer.general.city + ', ' + customer.general.state + ' ' + customer.general.zip
        content = <main>
            <div className='info'>
                <div className='customer-name'>{name}</div>
                <div className='customer-phone'>{customer.general.phone_number}</div>
                <div className='customer-address'>{address}</div>
            </div>
            <div className='customer-summary'>
                <SummaryContainer text_to_show='Total Sales' data_to_show={customer.sales.totalSales}/>
                <SummaryContainer text_to_show='Total Value' data_to_show={'$' + customer.sales.totalValue}/>
                <SummaryContainer text_to_show='Most Buyed Product' data_to_show={customer.sales.mostBuyedProduct.name}/>
            </div>
            <div className='sales'>
                <div className='table-title sales'>Recent Sales</div>
                <Table 
                header_array={['Products', 'Sale', 'Date', 'Total Amount', 'Payment Method', 'Location', 'Staff']}
                data_array={recentSales}
                mainData='sale'
                />
            </div>
        </main>
    }

    return (
        <div className='page customer-detail'>
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete} />}
            <MainNavbar />
            {content}
            <ButtonContainer 
                create={true}
                edit={true}
                del={true}
                createURL='/customer/create'
                editURL={`/customer/${id}/edit`}
                handleDelete={openModal}
            />
        </div>
    )
}

export default CustomerDetailPage