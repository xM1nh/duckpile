import './_SalesPage.css'

import { useEffect, useState } from 'react'

import { useGetSalesQuery, useDeleteSaleMutation } from '../../features/sales/salesApiSlice'

import usePagination from "../../hooks/usePagination"

import MainNavbar from '../../components/navbar/MainNavbar'
import Pagination from "../../components/pagination/Pagination"
import Table from "../../components/container/Table"
import SummaryContainer from '../../components/container/SummaryContainer'
import ButtonContainer from '../../components/buttons/ButtonContainer'
import DeleteModal from '../../components/modal/DeleteModal'
import Spinner from '../../components/spinner/Spinner'

const itemNumberPerPage = 25

const SalePage = () => { 
    const [deleteItem, setDeleteItem] = useState(null)
    const [count, setCount] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)

    const {
        currentPage, 
        pageCount, 
        handleNext, 
        handlePrev, 
        handlePage
    } = usePagination(count, itemNumberPerPage)

    const {
        data,
        isLoading: salesIsLoading,
        isSuccess,
        isError,
        error
    } = useGetSalesQuery({page: currentPage, count: itemNumberPerPage})

    const [deleteSale, {isLoading}] = useDeleteSaleMutation()

    const openModal = (e) => {
        setModalOpen(true)
        setDeleteItem(e.target.id)
    }

    const closeModal = () => {
        setModalOpen(false)
        setDeleteItem(null)
    }

    const handleDelete = async () => {
        if (!isLoading) {
            try {
                await deleteSale(deleteItem)
                setModalOpen(false)
                setDeleteItem(null)
            } catch (err) {
                console.error(err)
            }
        } else {
            console.log('Loading')
        }
    }

    useEffect(() => {
        if (data) {
            setCount(data.totalCount)
        }
    }, [data])

    let content

    if (salesIsLoading) content = <Spinner />
    if (isSuccess) {
        const { ids, entities } = data
        const tableContents = ids.map(id => entities[id]).map(sale => {
            const {products, ...rest} = sale
            let result = ''
            sale.products.forEach(product => {
                result += product.quantity.toString().concat('x ', product.product_name, ', ')
            })
            return {result, ...rest}
        })

        content = 
                <main>
                    <section className="summary">
                        <SummaryContainer data_to_show={data.totalCount} text_to_show='Total Sales'/>
                        <SummaryContainer data_to_show={data.mostBuyedProduct} text_to_show='Most Buyed Product'/>
                        <SummaryContainer data_to_show={data.mostBuyedCustomer} text_to_show='Most Buyed Customer'/>
                    </section>
                    <section className="recent-sales">
                        <div className="sales-table">
                            <div className="sales-table-title">Recent sales</div>
                            <div className="sales-table-content">
                                <Table 
                                    header_array={['Products','Code', 'Sale Date', 'Total Amount', 'Payment Method', 'Customer', 'Store', 'Staff']}
                                    data_array={tableContents}
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
                </main>
    }

    return (
        <div className='page sales'>
            {modalOpen && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            <MainNavbar />
            {content}
            <ButtonContainer create={true} createURL='/sale/create' />
        </div>
    )
}

export default SalePage