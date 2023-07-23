import './_ProductListPage.css'

import { useEffect, useState} from "react"

import { useGetProductsQuery, useDeleteProductMutation } from "../../features/products/productsApiSlice"

import usePagination from "../../hooks/usePagination"

import MainNavbar from "../../components/navbar/MainNavbar"
import Pagination from "../../components/pagination/Pagination"
import Table from "../../components/container/Table"
import SummaryContainer from "../../components/container/SummaryContainer"
import ButtonContainer from "../../components/buttons/ButtonContainer"
import DeleteModal from "../../components/modal/DeleteModal"
import Spinner from "../../components/spinner/Spinner"

const itemNumberPerPage = 25

const ProductListPage = () => { 
    const [count, setCount] = useState(0)
    const {
        currentPage, 
        pageCount, 
        handleNext, 
        handlePrev, 
        handlePage
    } = usePagination(count, itemNumberPerPage)
    const {
        data: products,
        isLoading: productsIsLoading,
        isSuccess,
        isError,
        error
    } = useGetProductsQuery({page: currentPage, count: itemNumberPerPage})

    const [deleteProduct, {isLoading}] = useDeleteProductMutation()
    
    const [openModal, setOpenModal] = useState(false)
    const [deleteItem, setDeleteItem] = useState(null)

    const tableOpenModal = (e) => {
        setOpenModal(true)
        setDeleteItem(e.target.id)
    }
    const closeModal = () => {
        setOpenModal(false)
        setDeleteItem(null)
    }

    const handleDelete = async () => {
        try {
            await deleteProduct(deleteItem)
            console.log('Deleted')
                setOpenModal(false)
                setDeleteItem(null)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (products) setCount(products.totalCount)
    }, [products])

    let content

    if (productsIsLoading) content = <Spinner />
    if (isSuccess) {
        const { ids, entities } = products
        const tableContents = ids?.length
            ? ids.map(id => entities[id])
            : []
        content = <main>
                        <section className="summary">
                            <SummaryContainer data_to_show={count} text_to_show='Total Products'/>
                            <SummaryContainer />
                            <SummaryContainer />
                        </section>
                        <section className="product_list">
                            <div className="product-table">
                                <div className="table-title products">All Products</div>
                                <div className="product-table-content">
                                    <Table
                                        mainData='product' 
                                        header_array={['Image', 'Name', 'Type', 'Brand', 'Supplier', 'SKU', 'Content', 'Expire Date', 'Price', 'Discount', 'Store 1 Inventory', 'Store 2 Inventory', 'Store 3 Inventory']}
                                        data_array={tableContents}
                                        handleDelete={tableOpenModal}
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
                    
                    <ButtonContainer create={true} createURL='/product/create'/>
                </main>
    }

    return (
        <div className='page product_list'>
            {openModal && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            <MainNavbar />
            {content}
        </div>
    )
}

export default ProductListPage