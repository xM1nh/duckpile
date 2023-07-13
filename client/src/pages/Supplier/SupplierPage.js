import MainNavBar from '../../components/navbar/MainNavbar'
import './_SupplierPage.css'
import Table from '../../components/container/Table'
import Pagination from '../../components/pagination/Pagination'
import usePagination from '../../hooks/usePagination'
import useFetch from '../../hooks/useFetch'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import { useEffect, useState } from 'react'

const itemNumPerPage = 10

const SupplierPage = () => {
    const [data, setData] = useState({
        list: [],
        count: 0
    })

    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(data.count, itemNumPerPage)

    const {isLoading, apiData, serverErr} = useFetch(`/api/v1/suppliers?page=${currentPage}&count=${itemNumPerPage}`)

    useEffect(() => {
        if (apiData) {
            setData({
                list: apiData.suppliers,
                count: apiData.count
            })
        }
    }, [apiData])

    return (
        <div className="page supplier">
            <MainNavBar />

            <main>
                <div className='supplier-list'>
                    <div className='supplier-list title'>Supplier List</div>
                    <div className='supplier-list table'>
                        <Table 
                            header_array={['Name', 'Address', 'Phone Number']} 
                            data_array={data.list}
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

                <ButtonContainer create={true} createURL='/supplier/create' />
            </main>
        </div>
    )
}

export default SupplierPage