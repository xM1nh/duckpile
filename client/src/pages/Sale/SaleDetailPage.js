import './_SaleDetailPage.css'
import Table from '../../components/container/Table'
import MainNavbar from '../../components/navbar/MainNavbar'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import useFetch from '../../hooks/useFetch'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const SaleDetailPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)

    const [customer, setCustomer] = useState({})
    const [product, setProduct] = useState({
        products: [],
    })
    const [other, setOther] = useState({})

    const {isLoading, apiData, serverErr} = useFetch(`/api/v1/sales/sale/${id}`)

    const openModal = () => {
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleDelete = () => {
        fetch(`/api/v1/sales/sale/${id}/delete`, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Success') {
                console.log('Deleted')
                setModalOpen(false)
                navigate(-1)
            }
        })
    }

    useEffect(() => {
        if (apiData) {
            const {customer, sale, ...rest} = apiData
            setCustomer(customer)
            setProduct(sale)
            setOther({...rest})
        }
    }, [apiData])

    return (
        <div className='page sale-detail'>
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            <MainNavbar />

            <main>
                <div className='customer-info'>
                    <h1>Customer Info</h1>
                    <div id='name'>
                        <div className='label'>Customer Name:</div>
                        <div className='value name'>{customer.name}</div>
                    </div>
                    <div id='phone'>
                        <div className='label'>Phone Number:</div>
                        <div className='value phone'>{customer.phone}</div>
                    </div>
                    <div id='address'>
                        <div className='label'>Address:</div>
                        <div className='value adress'>{customer.address}</div>
                    </div>
                </div>

                <div className='product-info'>
                    <h1>Details</h1>
                    <div className='list-section'>
                        <Table header_array={['Product', 'Price per unit', 'Quantity']} data_array={product.products} mainData='product'/>
                        <div className='total'>
                            <div className='title'>Total</div>
                            <div className='amount'>{product.totalAmount}</div>
                        </div>
                    </div>
                </div>

                <div className='sale-info'>
                    <h1>Sale Info</h1>
                    <div id='payment'>
                        <div className='label'>Payment Type:</div>
                        <div className='value payment'>{product.paymentMethod}</div>
                    </div>
                    <div id='staff'>
                        <div className='label'>Staff name:</div>
                        <div className='value staff'>{other.staff}</div>
                    </div>
                    <div id='store'>
                        <div className='label'>Store:</div>
                        <div className='value store'>{other.store}</div>
                    </div>
                    <div id='date'>
                        <div className='label'>Date:</div>
                        <div className='value date'>{other.date}</div>
                    </div>
                </div>
                <ButtonContainer 
                    create={true}
                    edit={true}
                    del={true}
                    createURL='/sale/create' 
                    editURL={`/sale/${id}/edit`}
                    handleDelete={openModal}/>
            </main>
        </div>
    )
}

export default SaleDetailPage