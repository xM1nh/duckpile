import SummaryContainer from '../components/container/SummaryContainer'
import useFetch from '../hooks/useFetch'
import { useParams } from 'react-router-dom'
import './_ProductDetailPage.css'
import ProductNavbar from '../components/navbar/ProductNavbar'
import Table from '../components/container/Table'

const ProductDetailPage = () => {
    const {id} = useParams()
    const {isLoading, apiData, serverErr} = useFetch(`http://127.0.0.1:3000/api/v1/products/product/${id}`)
    
    console.log(apiData)
    const product = {}

    return (
    <div className="page product-detail-page">
        <ProductNavbar />
        
        <main>
            <div className="product-detail info">
                <div className="product-detail-image-container">{product.image}</div>
                <div className='product-detail-info-container'>
                    <div className="product-detail-name">{product.name}</div>
                    <div className="product-detail-brand">{product.brand}</div>
                    <div className="product-detail-sku">{product.sku}</div>
                    <div className="product-detail-supplier">{product.supplier}</div>
                </div>
            </div>

            <div className="product-detail summary">
                <SummaryContainer />
                <SummaryContainer />
                <SummaryContainer />
            </div>

            <div className='product-detail detail'>
                <div className='product-detail-recent-sales'>
                    <Table 
                        header_array={['Name', 'Type', 'Brand', 'Supplier', 'SKU', 'Content', 'Images', 'Expire Date', 'Price', 'Discount']}
                        data_array={[]}/>
                </div>
                <div className='product-detail-recent-purchase'>
                    <Table 
                        header_array={['Name', 'Type', 'Brand', 'Supplier', 'SKU', 'Content', 'Images', 'Expire Date', 'Price', 'Discount']}
                        data_array={[]}
                        />
                </div>
            </div>
        </main>
    </div>
    )
}

export default ProductDetailPage