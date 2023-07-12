import MainNavbar from '../../components/navbar/MainNavbar'
import Pagination from "../../components/pagination/Pagination"
import useFetch from '../../hooks/useFetch'
import usePagination from "../../hooks/usePagination"
import './_SalesPage.css'
import Table from "../../components/container/Table"
import SummaryContainer from '../../components/container/SummaryContainer'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import { useEffect, useState } from 'react'

const itemNumPerPage = 10

const SalePage = () => { 
    const [deleteItem, setDeleteItem] = useState(null)
    const [data, setData] = useState({
        summary: [],
        count: '',
        mostBuyedProduct: '',
        mostBuyedCustomer: '',
    })

    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(data.count, itemNumPerPage)
    const [modalOpen, setModalOpen] = useState(false)

    var url = `/api/v1/sales?page=${currentPage}&count=${itemNumPerPage}`
    const {isLoading, apiData, serverErr} = useFetch(url)

    const openModal = (e) => {
        setModalOpen(true)
        setDeleteItem(e.target.id)
    }

    const closeModal = () => {
        setModalOpen(false)
        setDeleteItem(null)
    }

    const handleDelete = () => {
        fetch(`/api/v1/sales/sale/${deleteItem}/delete`, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Success') {
                console.log('Deleted')
                setModalOpen(false)
                setDeleteItem(null)
                window.location.reload()
            }
        })
    }

    useEffect(() => {
        if (apiData) {
            setData(apiData)
        }
    }, [apiData])

    return (
        <div className='page sales'>
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            <MainNavbar />

            <main>
                <section className="summary">
                    <SummaryContainer data_to_show={data.count} text_to_show='Total Sales'/>
                    <SummaryContainer data_to_show={data.mostBuyedProduct} text_to_show='Most Buyed Product'/>
                    <SummaryContainer data_to_show={data.mostBuyedCustomer} text_to_show='Most Buyed Customer'/>
                </section>
                <section className="recent-sales">
                    <div className="sales-table">
                        <div className="sales-table-title">Recent sales</div>
                        <div className="sales-table-content">
                            <Table 
                                header_array={['Products','Code', 'Sale Date', 'Total Amount', 'Payment Method', 'Customer', 'Store', 'Staff']}
                                data_array={data.summary}
                                mainData='sale'
                                handleDelete={openModal}
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

                <ButtonContainer create={true} createURL='/sale/create' />
            </main>
        </div>
    )
}

export default SalePage