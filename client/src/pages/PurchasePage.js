import MainNavbar from '../components/navbar/MainNavbar'
import Pagination from "../components/pagination/Pagination"
import useFetch from '../hooks/useFetch'
import usePagination from "../hooks/usePagination"
import './_PurchasePage.css'
import Table from "../components/container/Table"
import SummaryContainer from '../components/container/SummaryContainer'

const itemNumPerPage = 10
const itemCount = 9

const ProductListPage = () => { 
    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(itemCount, itemNumPerPage)

    var url = `/api/v1/purchases/${currentPage}/${itemNumPerPage}`

    const {isLoading, apiData, serverErr} = useFetch(url)

    return (
        <div className='page purchase'>
            <MainNavbar />

            <main>
                <section className="summary">
                    <SummaryContainer />
                    <SummaryContainer />
                    <SummaryContainer />
                </section>
                <section className="recent-purchase">
                    <div className="purchase-table">
                        <div className="purchase-table-title">Recent Purchases</div>
                        <div className="purchase-table-content">
                            <Table 
                                header_array={['Purchased Date', 'Item', 'Quantity', 'Store', 'Supplier', 'Staff']}
                                data_array={apiData}
                                mainData='purchase'
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