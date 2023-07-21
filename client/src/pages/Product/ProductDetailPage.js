import './_ProductDetailPage.css'

import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { useGetProductQuery } from '../../features/products/productsApiSlice'
import { selectSalesFromProductId, useGetSalesQuery } from '../../features/sales/salesApiSlice'
import { useSelector } from 'react-redux'

import SummaryContainer from '../../components/container/SummaryContainer'
import Table from '../../components/container/Table'
import Spinner from '../../components/spinner/Spinner'
import ShowItemContainer from '../../components/container/ShowItemContainer'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import MainNavbar from '../../components/navbar/MainNavbar'
import DeleteModal from '../../components/modal/DeleteModal'

const ProductDetailPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const {
        data: product,
        isLoading: productIsLoading,
        isSuccess: productIsSuccess,
        isError: productIsError,
        error: productError
    } = useGetProductQuery(id)
    
    const {
        data,
    } = useGetSalesQuery()

    const recentSales = useSelector(state => 
        selectSalesFromProductId(state, parseInt(id))
        ).map(sale => {
            const {products, ...rest} = sale
            return {...rest}
        })

    const [mainImg, setMainImg] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    const handleImageClick = (e) => {
        setMainImg(e.target.src)
    }

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

    let content

    if (productIsLoading) content = <Spinner />

    if (productIsSuccess) {
        const total_inv = parseInt(product.general.inventory_store_1) + parseInt(product.general.inventory_store_2) + parseInt(product.general.inventory_store_3)
        content = <main>
                    <div className="product-detail info">
                        <div className="product-detail-image-container">
                            <div className='image-list'>
                                {
                                    product.images.map(image => {
                                            return (
                                                <img key={uuidv4()} onClick={handleImageClick} src={image} alt=''></img>
                                            )
                                        }
                                    )
                                }
                            </div>
                            <div className='main-image'>
                                <img src={mainImg} alt=''></img>
                            </div>
                        </div>
                            <div className='product-detail-info-container'>
                                <div className="product-detail-name">{product.general.product_name}</div>
                                <div className='price'>
                                    <div className='product-detail-price'>Regular Price: {product.general.price}</div>
                                    <div className='product-detail-discount'>Discount: {product.general.discount}</div>
                                </div>
                                <div className='product-detail-type'>Type: {product.general.type}</div>
                                <div className='product-detail-content'>{product.general.content}</div>
                                <div className='supplier'>
                                    <div className="product-detail-brand">Brand: {product.general.brand}</div>
                                    <div className="product-detail-sku">SKU: {product.general.sku}</div>
                                    <div className="product-detail-supplier">Supplier: {product.general.supplier_name}</div>
                                </div>
                            </div>
                    </div>

                    <div className="product-detail summary">
                        <SummaryContainer data_to_show={0} text_to_show='Total Sales'/>
                        <SummaryContainer data_to_show={total_inv} text_to_show='Total Inventory'/>
                        <ShowItemContainer 
                                productName={product.general.product_name}
                                productImg={product.images[0]}
                                showName={product.show.show}
                                showDate={product.show.date}
                                showPrice={product.show.price}
                                showContent={product.show.content}    
                            />
                    </div>

                    <div className='product-detail detail'>
                        <div className='product-detail-recent-sales'>
                            <div className='title'>Recent Sales</div>
                                <Table 
                                    header_array={['Code','Sale Date', 'Quantity', 'Customer', 'Payment Method','Store', 'Staff']}
                                    data_array={recentSales}
                                    mainData='sale'/>
                        </div>
                        <div className='product-detail-recent-purchase'>
                            <div className='title'>Recent Purchases</div>
                                <Table 
                                    header_array={['Code', 'Purchased Date', 'Quantity', 'Store', 'Supplier', 'Staff']}
                                    data_array={recentSales}
                                    mainData='purchase'
                                />
                        </div>
                    </div>
                </main>
    }

    return (
        <div className="page product-detail-page">
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            {productIsSuccess && <MainNavbar />}
            {content}
            <ButtonContainer 
                create={true}
                edit={true}
                del={true}
                addURL='/product/create'
                editURL={`/product/${id}/edit`}
                handleDelete={openModal}
            />
        </div>
    )
}

export default ProductDetailPage