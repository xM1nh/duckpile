import PurchaseNavbar from '../components/navbar/PurchaseNavbar'
import Pagination from "../components/pagination/Pagination"
import useFetch from '../hooks/useFetch'
import usePagination from "../hooks/usePagination"
import './_PurchasePage.css'
import Table from "../components/container/Table"

const itemNumPerPage = 1
const itemCount = 9

const ProductListPage = () => { 
    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(itemCount, itemNumPerPage)

    var url = `/api/v1/purchases/${currentPage}/${itemNumPerPage}`

    const {isLoading, apiData, serverErr} = useFetch(url)

    return (
        <div className='page purchase'>
            <PurchaseNavbar />

            <main>
                <section className="summary">sdfgsdgf</section>
                <section className="recent-purchase">
                    <div className="purchase-table">
                        <div className="purchase-table-title">Recent Purchases</div>
                        <div className="purchase-table-content">
                            <Table 
                                header_array={['Item', 'Quantity', 'Purchased Date', 'Store', 'Supplier', 'Staff']}
                                data_array={apiData}
                                param='purchase'
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