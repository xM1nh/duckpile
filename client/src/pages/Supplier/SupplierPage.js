import MainNavBar from '../../components/navbar/MainNavbar'
import './_SupplierPage.css'
import Table from '../../components/container/Table'
import Pagination from '../../components/pagination/Pagination'
import usePagination from '../../hooks/usePagination'
import useFetch from '../../hooks/useFetch'
import ButtonContainer from '../../components/buttons/ButtonContainer'

const itemCount = 1000
const itemNumPerPage = 10

const SupplierPage = () => {
    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(itemCount, itemNumPerPage)

    const {isLoading, apiData, serverErr} = useFetch('/api/v1/suppliers')

    return (
        <div className="page supplier">
            <MainNavBar />

            <main>
                <div className='supplier-list'>
                    <div className='supplier-list title'>Supplier List</div>
                    <div className='supplier-list table'>
                        <Table 
                            header_array={['Name', 'Address', 'Phone Number']} 
                            data_array={apiData}
                            mainData='supplier'/>
                    </div>
                    <Pagination 
                        currentPage={currentPage} 
                        pageCount={pageCount}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        handlePage={handlePage}
                    />
                </div>

                <ButtonContainer add={true} addURL='/supplier/add' />
            </main>
        </div>
    )
}

export default SupplierPage