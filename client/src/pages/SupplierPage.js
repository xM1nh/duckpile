import MainNavBar from '../components/navbar/MainNavbar'
import './_SupplierPage.css'
import Table from '../components/container/Table'
import Pagination from '../components/pagination/Pagination'
import usePagination from '../hooks/usePagination'

const itemCount = 1000
const itemNumPerPage = 10

const SupplierPage = () => {
    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(itemCount, itemNumPerPage)

    return (
        <div className="page supplier">
            <MainNavBar />

            <main>
                <div className='supplier-list'>
                    <div className='supplier-list title'>Supplier List</div>
                    <div className='supplier-list table'>
                        <Table header_array={['table']} data_array={[]}/>
                    </div>
                    <Pagination 
                        currentPage={currentPage} 
                        pageCount={pageCount}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        handlePage={handlePage}
                    />
                </div>
            </main>
        </div>
    )
}

export default SupplierPage