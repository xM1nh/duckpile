import './_CustomerPage.css'

import { useEffect, useState } from 'react'

import { useGetCustomersQuery, useDeleteCustomerMutation } from '../../features/customers/customersApiSlice'

import usePagination from '../../hooks/usePagination'

import MainNavBar from '../../components/navbar/MainNavbar'
import Table from '../../components/container/Table'
import Pagination from '../../components/pagination/Pagination'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import Spinner from '../../components/spinner/Spinner'

const itemNumberPerPage = 25

const CustomerPage = () => {
    const [count, setCount] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteItem, setDeleteItem] = useState(null)
    const {
        currentPage, 
        pageCount, 
        handleNext, 
        handlePrev, 
        handlePage
    } = usePagination(count, itemNumberPerPage)

    const {
        data: customers,
        isLoading: customersIsLoading,
        isSuccess,
        isError,
        error
    } = useGetCustomersQuery({page: currentPage, count: itemNumberPerPage})

    const [deleteCustomer, {isloading}] = useDeleteCustomerMutation()

    const tableOpenModal = (e) => {
        setModalOpen(true)
        setDeleteItem(e.target.id)
    }

    const closeModal = () => {
        setModalOpen(false)
        setDeleteItem(null)
    }

    const handleDelete = async () => {
        try {
            await deleteCustomer(deleteItem)
            setModalOpen(false)
            setDeleteItem(null)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (customers) setCount(customers.totalCount)
    }, [customers])

    let content

    if (customersIsLoading) content = <Spinner />
    if (isSuccess) {
        const { ids, entities } = customers
        const tableContents = ids?.length
            ? ids.map(id => entities[id])
            : []
        content = 
                <main>
                    <div className='customer-list'>
                        <div className='customer-list title'>Customer List</div>
                            <div className='customer-list table'>
                                <Table 
                                    header_array={['Name', 'Address', 'Phone Number']} 
                                    data_array={tableContents}
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
                </main>
    }

    return (
        <div className="page customer">
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            <MainNavBar />
            {content}
            <ButtonContainer create={true} createURL='/customer/create' />
        </div>
    )
}

export default CustomerPage