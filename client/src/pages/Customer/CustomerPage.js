import MainNavBar from '../../components/navbar/MainNavbar'
import './_CustomerPage.css'
import Table from '../../components/container/Table'
import Pagination from '../../components/pagination/Pagination'
import usePagination from '../../hooks/usePagination'
import useFetch from '../../hooks/useFetch'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import { useEffect, useState } from 'react'

const itemNumPerPage = 10

const CustomerPage = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteItem, setDeleteItem] = useState(null)
    const [data, setData] = useState({
        list: [],
        count: 0
    })

    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(data.count, itemNumPerPage)
    const {isLoading, apiData, serverErr} = useFetch(`/api/v1/customers?page=${currentPage}&count=${itemNumPerPage}`)

    const tableOpenModal = (e) => {
        setModalOpen(true)
        setDeleteItem(e.target.id)
    }

    const closeModal = () => {
        setModalOpen(false)
        setDeleteItem(null)
    }

    const handleDelete = (e) => {
        fetch(`/api/v1/customers/customer/${deleteItem}/delete`, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.message)
            setModalOpen(false)
            setDeleteItem(null)
            window.location.reload()
        })
    }

    useEffect(() => {
        if (apiData) {
            setData({
                list: apiData.customers,
                count: apiData.count
            })
        }
    }, [apiData])

    return (
        <div className="page customer">
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            <MainNavBar />

            <main>
                <div className='customer-list'>
                    <div className='customer-list title'>Customer List</div>
                    <div className='customer-list table'>
                        <Table 
                            header_array={['Name', 'Address', 'Phone Number']} 
                            data_array={data.list}
                            mainData='customer'
                            handleDelete={tableOpenModal}/>
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