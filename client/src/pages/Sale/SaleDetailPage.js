import './_SaleDetailPage.css'

import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useGetSaleQuery, useDeleteSaleMutation } from '../../features/sales/salesApiSlice'

import Table from '../../components/container/Table'
import MainNavbar from '../../components/navbar/MainNavbar'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import Spinner from '../../components/spinner/Spinner'

const SaleDetailPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)

    const {
        data,
        isLoading: saleIsLoading,
        isSuccess,
        isError,
        error
    } = useGetSaleQuery(id)

    const [deleteSale, {isLoading: deleteIsLoading}] = useDeleteSaleMutation()

    const openModal = () => {
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleDelete = async () => {
        if (!deleteIsLoading) {
            try {
                await deleteSale(id)
                setModalOpen(false)
                navigate(-1)
            } catch (err) {
                console.error(err)
            }
        }
    }

    let content

    if (saleIsLoading) content = <Spinner />
    if (isSuccess) {
        content = 
                <main>
                    <div className='sale-info'>
                        <h1>Sale Info</h1>
                        <div id='payment'>
                            <div className='label'>Payment Type:</div>
                            <div className='value payment'>{data.sale.paymentMethod}</div>
                        </div>
                        <div id='staff'>
                            <div className='label'>Staff name:</div>
                            <div className='value staff'>{data.staff}</div>
                        </div>
                        <div id='store'>
                            <div className='label'>Store:</div>
                            <div className='value store'>{data.store.name}</div>
                        </div>
                        <div id='date'>
                            <div className='label'>Date:</div>
                            <div className='value date'>{data.date}</div>
                        </div>
                    </div>

                    <div className='product-info'>
                        <h1>Details</h1>
                        <div className='list-section'>
                            <Table 
                                header_array={['Product', 'Price per unit', 'Quantity']} 
                                data_array={data.sale.products} 
                                mainData='product'
                            />
                            <div className='total'>
                                <div className='title'>Total</div>
                                <div className='amount'>{data.sale.totalAmount}</div>
                            </div>
                        </div>
                    </div>

                    <div className='customer-info'>
                        <h1>Customer Info</h1>
                        <div id='name'>
                            <div className='label'>Customer Name:</div>
                            <div className='value name'>{data.customer.firstName + ' ' + data.customer.lastName}</div>
                        </div>
                        <div id='phone'>
                            <div className='label'>Phone Number:</div>
                            <div className='value phone'>{data.customer.phone}</div>
                        </div>
                        <div id='address'>
                            <div className='label'>Address:</div>
                            <div className='value adress'>{data.customer.address}</div>
                        </div>
                    </div>
                </main>
    }

    return (
        <div className='page sale-detail'>
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            <MainNavbar />
            {content}
            <ButtonContainer 
                create={true}
                edit={true}
                del={true}
                createURL='/sale/create' 
                editURL={`/sale/${id}/edit`}
                handleDelete={openModal}/>
        </div>
    )
}

export default SaleDetailPage