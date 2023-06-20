import MainNavBar from '../components/navbar/MainNavbar'
import './_CustomerPage.css'
import Table from '../components/container/Table'
import Pagination from '../components/pagination/Pagination'
import usePagination from '../hooks/usePagination'
import useFetch from '../hooks/useFetch'

const itemCount = 1000
const itemNumPerPage = 10

const CustomerPage = () => {
    const {isLoading, apiData, serverErr} = useFetch('/api/v1/customers')
    console.log(apiData)

    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(itemCount, itemNumPerPage)

    return (
        <div className="page customer">
            <MainNavBar />

            <main>
                <div className='customer-list'>
                    <div className='customer-list title'>Customer List</div>
                    <div className='customer-list table'>
                        <Table header_array={['Name', 'Address', 'Phone Number']} data_array={apiData}/>
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

export default CustomerPage