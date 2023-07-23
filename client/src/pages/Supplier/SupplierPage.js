import './_SupplierPage.css'

import { useEffect, useState } from 'react'

import { useGetSuppliersQuery, useDeleteSupplierMutation } from '../../features/suppliers/suppliersApiSlice'

import usePagination from '../../hooks/usePagination'

import MainNavBar from '../../components/navbar/MainNavbar'
import Table from '../../components/container/Table'
import Pagination from '../../components/pagination/Pagination'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import Spinner from '../../components/spinner/Spinner'

const itemNumberPerPage = 25

const SupplierPage = () => {
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
        data: suppliers,
        isLoading: suppliersIsLoading,
        isSuccess,
        isError,
        error
    } = useGetSuppliersQuery({page: currentPage, count: itemNumberPerPage})

    const [deleteSupplier, {isloading}] = useDeleteSupplierMutation()

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
            await deleteSupplier(deleteItem)
            setModalOpen(false)
            setDeleteItem(null)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (suppliers) setCount(suppliers.totalCount)
    }, [suppliers])

    let content

    if (suppliersIsLoading) content = <Spinner />
    if (isSuccess) {
        const { ids, entities } = suppliers
        const tableContents = ids?.length
            ? ids.map(id => entities[id])
            : []
        content = 
                <main>
                    <div className='supplier-list'>
                        <div className='supplier-list title'>Supplier List</div>
                            <div className='supplier-list table'>
                                <Table 
                                    header_array={['Name', 'Address', 'Phone Number']} 
                                    data_array={tableContents}
                                    mainData='supplier'
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
        <div className="page supplier">
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            <MainNavBar />
            {content}
            <ButtonContainer create={true} createURL='/supplier/create' />
        </div>
    )
}

export default SupplierPage