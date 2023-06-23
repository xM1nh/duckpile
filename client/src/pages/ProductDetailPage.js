import SummaryContainer from '../components/container/SummaryContainer'
import useFetch from '../hooks/useFetch'
import { useParams } from 'react-router-dom'
import './_ProductDetailPage.css'
import ProductNavbar from '../components/navbar/ProductNavbar'
import Table from '../components/container/Table'
import Spinner from '../components/spinner/Spinner'
import ShowItemContainer from '../components/container/ShowItemContainer'

const ProductDetailPage = () => {
    const {id} = useParams()
    const { isLoading, apiData, serverErr } = useFetch(`/api/v1/products/product/${id}`)

    if (isLoading) return <Spinner />
    else if (serverErr) return (<div>404</div>)
    else {
        const total_sales = apiData.sales 
                                ? apiData.sales.reduce((sum, curr) => {
                                    return sum + curr.quantity
                                    }, 0) 
                                : <Spinner />

        const total_inv = apiData.inventory 
                            ? apiData.inventory.reduce((sum, curr) => {
                                if (curr.sum === undefined) curr.sum = 0
                                return sum + Number(curr.sum)
                                }, 0)
                            : <Spinner />

        return (
            <div className="page product-detail-page">
                <ProductNavbar />
                
                <main>
                    <div className="product-detail info">
                        <div className="product-detail-image-container">{apiData.general ? apiData.general.image : <Spinner />}</div>
                        <div className='product-detail-info-container'>
                            <div className="product-detail-name">{apiData.general ? apiData.general.product_name : <Spinner />}</div>
                            <div className='product-detail-content'>{apiData.general ? apiData.general.content : <Spinner />}</div>
                            <div className="product-detail-brand">{apiData.general ? apiData.general.brand : <Spinner />}</div>
                            <div className="product-detail-sku">{apiData.general ? apiData.general.sku : <Spinner />}</div>
                            <div className="product-detail-supplier">{apiData.general ? apiData.general.supplier_name : <Spinner />}</div>
                        </div>
                    </div>

                    <div className="product-detail summary">
                        <SummaryContainer data_to_show={total_sales} text_to_show='Total Sales'/>
                        <SummaryContainer id='inventory' data_to_show={total_inv} text_to_show='Total Inventory'/>
                        <ShowItemContainer 
                            productName={apiData.general ? apiData.general.product_name : <Spinner />}
                            productImg={apiData.general ? apiData.general.image : <Spinner />}
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
                                data_array={apiData.sales ? apiData.sales : []}
                                mainData='sale'/>
                        </div>
                        <div className='product-detail-recent-purchase'>
                            <div className='title'>Recent Purchases</div>
                            <Table 
                                header_array={['Code', 'Purchased Date', 'Quantity', 'Store', 'Supplier', 'Staff']}
                                data_array={apiData.purchases ? apiData.purchases : []}
                                mainData='purchase'
                                />
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

export default ProductDetailPage