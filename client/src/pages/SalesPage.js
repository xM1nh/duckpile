import MainNavbar from '../components/navbar/MainNavbar'
import Pagination from "../components/pagination/Pagination"
import useFetch from '../hooks/useFetch'
import usePagination from "../hooks/usePagination"
import './_SalesPage.css'
import Table from "../components/container/Table"
import SummaryContainer from '../components/container/SummaryContainer'
import ButtonContainer from '../components/buttons/ButtonContainer'

const itemNumPerPage = 10
const itemCount = 9

const ProductListPage = () => { 
    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(itemCount, itemNumPerPage)
    
    var url = `/api/v1/sales/${currentPage}/${itemNumPerPage}`

    const {isLoading, apiData, serverErr} = useFetch(url)

    return (
        <div className='page sales'>
            <MainNavbar />

            <main>
                <section className="summary">
                    <SummaryContainer />
                    <SummaryContainer />
                    <SummaryContainer />
                </section>
                <section className="recent-sales">
                    <div className="sales-table">
                        <div className="sales-table-title">Recent sales</div>
                        <div className="sales-table-content">
                            <Table 
                                header_array={['Code', 'Sale Date', 'Item', 'Quantity', 'Customer', 'Store', 'Staff']}
                                data_array={apiData}
                                mainData='sale'
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

                <ButtonContainer add={true} addURL='/sale/add' />
            </main>
        </div>
    )
}

export default ProductListPage