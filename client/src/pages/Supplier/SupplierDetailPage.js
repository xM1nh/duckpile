import './_SupplierDetailPage.css'

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useGetSupplierQuery, useDeleteSupplierMutation } from '../../features/suppliers/suppliersApiSlice'
import { selectPurchasesFromSupplierId, useGetPurchasesQuery } from '../../features/purchases/purchasesApiSlice'
import { useSelector } from 'react-redux'

import MainNavbar from '../../components/navbar/MainNavbar'
import Table from '../../components/container/Table'
import SummaryContainer from '../../components/container/SummaryContainer'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import Spinner from '../../components/spinner/Spinner'


const SupplierDetailPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)

    const {
        data: supplier,
        isLoading: supplierIsLoading,
        isSuccess,
        isError,
        error
    } = useGetSupplierQuery(id)

    const {
        data,
    } = useGetPurchasesQuery({page: 1, count: 200})

    const recentPurchases = useSelector(state => 
        selectPurchasesFromSupplierId(state, parseInt(id))
        ).map(purchase => {
            const {products, supplier_name, ...rest} = purchase
            let result = ''
            purchase.products.forEach(product => {
                result += product.quantity.toString().concat('x ', product.product_name, ', ')
            })
            return {result, ...rest}
        })

    const [deleteSupplier, {isLoading}] = useDeleteSupplierMutation()

    const openModal = () => {
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleDelete = async () => {
        try {
            await deleteSupplier(id)
            setModalOpen(false)
            navigate(-1)
        } catch (err) {
            console.error(err)
        }
    }

    let content

    if (supplierIsLoading) content = <Spinner />
    if (isSuccess) {
        const name = supplier.general.name
        const address = supplier.general.street + ', ' + supplier.general.city + ', ' + supplier.general.state + ' ' + supplier.general.zip
        content = <main>
            <div className='info'>
                <div className='supplier-name'>{name}</div>
                <div className='supplier-phone'>{supplier.general.phone_number}</div>
                <div className='supplier-address'>{address}</div>
            </div>
            <div className='supplier-summary'>
                <SummaryContainer text_to_show='Total Purchases' data_to_show={supplier.purchases.totalPurchases}/>
                <SummaryContainer text_to_show='Total Value' data_to_show={'$' + supplier.purchases.totalValue}/>
                <SummaryContainer text_to_show='Most Purchased Product' data_to_show={supplier.purchases.mostPurchasedProduct.name}/>
            </div>
            <div className='purchases'>
                <div className='table-title purchases'>Recent Purchases</div>
                <Table 
                header_array={['Products', 'Purchase', 'Date', 'Total Amount', 'Payment Method', 'Location', 'Staff']}
                data_array={recentPurchases}
                mainData='purchase'
                />
            </div>
        </main>
    }

    return (
        <div className='page supplier-detail'>
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete} />}
            <MainNavbar />
            {content}
            <ButtonContainer 
                create={true}
                edit={true}
                del={true}
                createURL='/supplier/create'
                editURL={`/supplier/${id}/edit`}
                handleDelete={openModal}
            />
        </div>
    )
}

export default SupplierDetailPage