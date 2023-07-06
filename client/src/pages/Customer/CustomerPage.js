import MainNavBar from '../../components/navbar/MainNavbar'
import './_CustomerPage.css'
import Table from '../../components/container/Table'
import Pagination from '../../components/pagination/Pagination'
import usePagination from '../../hooks/usePagination'
import useFetch from '../../hooks/useFetch'
import ButtonContainer from '../../components/buttons/ButtonContainer'

const itemNumPerPage = 10

const CustomerPage = () => {
    const {isLoading, apiData, serverErr} = useFetch('/api/v1/customers')

    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(apiData.length, itemNumPerPage)

    return (
        <div className="page customer">
            <MainNavBar />

            <main>
                <div className='customer-list'>
                    <div className='customer-list title'>Customer List</div>
                    <div className='customer-list table'>
                        <Table 
                            header_array={['Name', 'Address', 'Phone Number']} 
                            data_array={apiData}
                            mainData='customer'/>
                    </div>
                    <Pagination 
                        currentPage={currentPage} 
                        pageCount={pageCount}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        handlePage={handlePage}
                    />
                </div>

                <ButtonContainer create={true} createURL='/customer/create' />
            </main>
        </div>
    )
}

export default CustomerPage