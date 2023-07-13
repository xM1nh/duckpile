import './_SupplierDetailPage.css'
import MainNavbar from '../../components/navbar/MainNavbar'
import Table from '../../components/container/Table'
import SummaryContainer from '../../components/container/SummaryContainer'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import useFetch from '../../hooks/useFetch'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const CustomerDetailPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)
    const [supplierData, setCustomerData] = useState({
        name: '',
        address: '',
        phone_number: '',
    })
    const [supplierPurchaseData, setCustomerPurchaseData] = useState({
        list: [],
        mostPurchasedProduct: [],
        totalPurchases: '',
        totalValue: ''
    })

    const {isLoading, apiData, serverErr} = useFetch(`/api/v1/suppliers/supplier/${id}`)

    const openModal = () => {
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleDelete = () => {
        fetch(`/api/v1/suppliers/supplier/${id}/delete`, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
            console.log('deleted')
            setModalOpen(false)
            navigate('/suppliers')
        })
    }
    
    useEffect(() => {
        if (apiData) {
            setCustomerData({
                name: apiData.general.name,
                address: apiData.general.street + ', ' + apiData.general.city + ', ' + apiData.general.state + ' ' + apiData.general.zip,
                phone_number: apiData.general.phone_number
            })
            setCustomerPurchaseData({
                list: apiData.sales.list,
                mostBuyedProduct: apiData.sales.mostPurchasedProduct ? apiData.sales.mostPurchasedProduct.name : 'No Data',
                totalPurchases: apiData.sales.totalPurchases,
                totalValue: apiData.sales.totalValue
            })
        }
    }, [apiData])

    return (
        <div className='page supplier-detail'>
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete} />}

            <MainNavbar />

            <main>
                <div className='info'>
                    <div className='supplier-name'>{supplierData.name}</div>
                    <div className='supplier-phone'>{supplierData.phone_number}</div>
                    <div className='supplier-address'>{supplierData.address}</div>
                </div>
                <div className='supplier-summary'>
                    <SummaryContainer text_to_show='Total Purchases' data_to_show={supplierPurchaseData.totalPurchases}/>
                    <SummaryContainer text_to_show='Total Value' data_to_show={'$' + supplierPurchaseData.totalValue}/>
                    <SummaryContainer text_to_show='Most Buyed Product' data_to_show={supplierPurchaseData.mostBuyedProduct}/>
                </div>
                <div className='sales'>
                    <div className='table-title sales'>All Purchases</div>
                    <Table 
                    header_array={['Products', 'Purchase', 'Date', 'Total Amount', 'Location', 'Staff']}
                    data_array={supplierPurchaseData.list}
                    mainData='sale'
                    />
                </div>

                <ButtonContainer 
                        create={true}
                        edit={true}
                        del={true}
                        createURL='/supplier/create'
                        editURL={`/supplier/${id}/edit`}
                        handleDelete={openModal}
                    />
            </main>
        </div>
    )
}

export default CustomerDetailPage