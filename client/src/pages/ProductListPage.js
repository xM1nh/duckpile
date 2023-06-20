import ProductNavbar from "../components/navbar/ProductNavbar"
import Pagination from "../components/pagination/Pagination"
import useFetch from '../hooks/useFetch'
import usePagination from "../hooks/usePagination"
import './_ProductListPage.css'
import Table from "../components/container/Table"

const itemNumPerPage = 1
const itemCount = 9

const ProductListPage = () => { 
    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(itemCount, itemNumPerPage)

    var url = `/api/v1/products/pages/${currentPage}/${itemNumPerPage}`

    const {isLoading, apiData, serverErr} = useFetch(url)

    return (
        <div className='page product_list'>
            <ProductNavbar />
            <main>
                <section className="summary">sdfgsdgf</section>
                <section className="product_list">
                    <div className="product-table">
                        <div className="product-table-title">All Products</div>
                        <div className="product-table-content">
                            <Table 
                                header_array={['Name', 'Type', 'Brand', 'Supplier', 'SKU', 'Content', 'Images', 'Expire Date', 'Price', 'Discount']}
                                data_array={apiData}
                                param='product'
                            />
                        </div>

                        <Pagination 
                            currentPage={currentPage} 
                            pageCount={pageCount}
                            handleNext={handleNext}
                            handlePrev={handlePrev}
                            handlePage={handlePage}
                        />
                    </div>
                </section>
            </main>
        </div>
    )
}

export default ProductListPage