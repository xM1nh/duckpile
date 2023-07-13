import './_PurchaseDetailPage.css'
import Table from '../../components/container/Table'
import MainNavbar from '../../components/navbar/MainNavbar'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import useFetch from '../../hooks/useFetch'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const PurchaseDetailPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)

    const [supplier, setSupplier] = useState({})
    const [product, setProduct] = useState({
        products: [],
    })
    const [other, setOther] = useState({})

    const {isLoading, apiData, serverErr} = useFetch(`/api/v1/purchases/purchase/${id}`)

    const openModal = () => {
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleDelete = () => {
        fetch(`/api/v1/purchases/purchase/${id}/delete`, {
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
            const {supplier, purchase, ...rest} = apiData
            setSupplier(supplier)
            setProduct(purchase)
            setOther({...rest})
        }
    }, [apiData])

    return (
        <div className='page purchase-detail'>
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            <MainNavbar />

            <main>
            <div className='purchase-info'>
                    <h1>Purchase Info</h1>
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

                <div className='product-info'>
                    <h1>Details</h1>
                    <div className='list-section'>
                        <Table header_array={['Product', 'Quantity']} data_array={product.products} mainData='product'/>
                        <div className='total'>
                            <div className='title'>Total</div>
                            <div className='amount'>{product.totalAmount}</div>
                        </div>
                    </div>
                </div>

                <div className='supplier-info'>
                    <h1>Supplier Info</h1>
                    <div id='name'>
                        <div className='label'>Supplier Name:</div>
                        <div className='value name'>{supplier.name}</div>
                    </div>
                    <div id='phone'>
                        <div className='label'>Phone Number:</div>
                        <div className='value phone'>{supplier.phone}</div>
                    </div>
                    <div id='address'>
                        <div className='label'>Address:</div>
                        <div className='value adress'>{supplier.address}</div>
                    </div>
                </div>
                <ButtonContainer 
                    create={true}
                    edit={true}
                    del={true}
                    createURL='/purchase/create' 
                    editURL={`/purchase/${id}/edit`}
                    handleDelete={openModal}/>
            </main>
        </div>
    )
}

export default PurchaseDetailPage