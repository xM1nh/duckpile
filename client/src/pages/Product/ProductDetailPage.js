import SummaryContainer from '../../components/container/SummaryContainer'
import useFetch from '../../hooks/useFetch'
import { useParams } from 'react-router-dom'
import './_ProductDetailPage.css'
import Table from '../../components/container/Table'
import Spinner from '../../components/spinner/Spinner'
import ShowItemContainer from '../../components/container/ShowItemContainer'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import MainNavbar from '../../components/navbar/MainNavbar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import DeleteModal from '../../components/modal/DeleteModal'

const ProductDetailPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [mainImg, setMainImg] = useState(null)
    const [data, setData] = useState({})
    const [sale, setSale] = useState([])
    const [purchase, setPurchase] = useState([])
    const [images, setImages] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const { isLoading, apiData, serverErr } = useFetch(`/api/v1/products/product/${id}`)

    const handleImageClick = (e) => {
        setMainImg(e.target.src)
    }

    const total_sales = sale.reduce((sum, curr) => {
        return sum + curr.quantity
        }, 0) 

    const total_inv = parseInt(data.inventory_store_1) + parseInt(data.inventory_store_2) + parseInt(data.inventory_store_3)

    const openModal = () => {
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleDelete = () => {
        fetch(`/api/v1/products/product/${id}/delete`, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
            console.log('deleted')
            setModalOpen(false)
            navigate('/products')
        })
    }

    useEffect(() => {
        if (apiData.general) {
            setData(apiData.general)
        }
        if (apiData.sales) {
            setSale(apiData.sales)
        }
        if (apiData.purchases) {
            setPurchase(apiData.purchases)
        }
        if (apiData.images) {
            setImages(apiData.images)
            setMainImg(apiData.images[0])
        }
    }, [apiData.general, apiData.sales, apiData.purchases, apiData.images])

    if (isLoading) return <Spinner />
    else if (serverErr) return (<div>404</div>)
    else {
        return (
            <div className="page product-detail-page">
                {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
                <MainNavbar />
                
                <main>
                    <div className="product-detail info">
                        <div className="product-detail-image-container">
                            <div className='image-list'>
                                {images.map(image => {
                                        return (
                                            <img key={uuidv4()} onClick={handleImageClick} src={image} alt=''></img>
                                        )
                                    }
                                )}
                            </div>
                            <div className='main-image'><img src={mainImg} alt=''></img></div>
                        </div>
                        <div className='product-detail-info-container'>
                            <div className="product-detail-name">{data.product_name}</div>
                            <div className='price'>
                                <div className='product-detail-price'>Regular Price: {data.price}</div>
                                <div className='product-detail-discount'>Discount: {data.discount}</div>
                            </div>
                            <div className='product-detail-type'>Type: {data.type}</div>
                            <div className='product-detail-content'>{data.content}</div>
                            <div className='supplier'>
                                <div className="product-detail-brand">Brand: {data.brand}</div>
                                <div className="product-detail-sku">SKU: {data.sku}</div>
                                <div className="product-detail-supplier">Supplier: {data.supplier_name}</div>
                            </div>
                        </div>
                    </div>

                    <div className="product-detail summary">
                        <SummaryContainer data_to_show={total_sales} text_to_show='Total Sales'/>
                        <SummaryContainer data_to_show={total_inv} text_to_show='Total Inventory'/>
                        <ShowItemContainer 
                            productName={data.product_name}
                            productImg={images[0]}
                            showName={apiData.show ? apiData.show.show : 'N/A'}
                            showDate={apiData.show ? apiData.show.date : 'N/A'}
                            showPrice={apiData.show ? apiData.show.price : 'N/A'}
                            showContent={apiData.show ? apiData.show.content : 'N/A'}    
                        />
                    </div>

                    <div className='product-detail detail'>
                        <div className='product-detail-recent-sales'>
                            <div className='title'>Recent Sales</div>
                            <Table 
                                header_array={['Code','Sale Date', 'Quantity', 'Customer', 'Payment Method','Store', 'Staff']}
                                data_array={sale}
                                mainData='sale'/>
                        </div>
                        <div className='product-detail-recent-purchase'>
                            <div className='title'>Recent Purchases</div>
                            <Table 
                                header_array={['Code', 'Purchased Date', 'Quantity', 'Store', 'Supplier', 'Staff']}
                                data_array={purchase}
                                mainData='purchase'
                                />
                        </div>
                    </div>

                    <ButtonContainer 
                        create={true}
                        edit={true}
                        del={true}
                        addURL='/product/create'
                        editURL={`/product/${id}/edit`}
                        handleDelete={openModal}
                    />
                </main>
            </div>
        )
    }
}

export default ProductDetailPage