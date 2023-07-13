import MainNavbar from '../../components/navbar/MainNavbar'
import Pagination from "../../components/pagination/Pagination"
import useFetch from '../../hooks/useFetch'
import usePagination from "../../hooks/usePagination"
import './_PurchasePage.css'
import Table from "../../components/container/Table"
import SummaryContainer from '../../components/container/SummaryContainer'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import { useEffect, useState } from 'react'

const itemNumPerPage = 10

const PurchasePage = () => { 
    const [deleteItem, setDeleteItem] = useState(null)
    const [data, setData] = useState({
        summary: [],
        count: '',
        mostBuyedProduct: '',
        mostBuyedCustomer: '',
    })

    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(data.count, itemNumPerPage)
    const [modalOpen, setModalOpen] = useState(false)

    var url = `/api/v1/purchases?page=${currentPage}&count=${itemNumPerPage}`
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
        fetch(`/api/v1/purchases/purchase/${deleteItem}/delete`, {
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
        <div className='page purchases'>
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            <MainNavbar />

            <main>
                <section className="summary">
                    <SummaryContainer data_to_show={data.count} text_to_show='Total Purchases'/>
                    <SummaryContainer data_to_show={data.mostPurchasedProduct} text_to_show='Most Purchased Product'/>
                    <SummaryContainer data_to_show={data.mostPurchasedSupplier} text_to_show='Most Purchased Supplier'/>
                </section>
                <section className="recent-purchases">
                    <div className="purchases-table">
                        <div className="purchases-table-title">Recent purchases</div>
                        <div className="purchases-table-content">
                            <Table 
                                header_array={['Products','Code', 'Purchase Date', 'Total Amount', 'Supplier', 'Store', 'Staff']}
                                data_array={data.summary}
                                mainData='purchase'
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

                <ButtonContainer create={true} createURL='/purchase/create' />
            </main>
        </div>
    )
}

export default PurchasePage