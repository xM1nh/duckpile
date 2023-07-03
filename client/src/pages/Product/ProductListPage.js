import MainNavbar from "../../components/navbar/MainNavbar"
import Pagination from "../../components/pagination/Pagination"
import useFetch from '../../hooks/useFetch'
import usePagination from "../../hooks/usePagination"
import './_ProductListPage.css'
import Table from "../../components/container/Table"
import SummaryContainer from "../../components/container/SummaryContainer"
import ButtonContainer from "../../components/buttons/ButtonContainer"
import DeleteModal from "../../components/modal/DeleteModal"
import { useState } from "react"

const itemNumPerPage = 10
const itemCount = 9

const ProductListPage = () => { 
    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(itemCount, itemNumPerPage)
    const url = `/api/v1/products/pages/${currentPage}/${itemNumPerPage}`
    const {isLoading, apiData, serverErr} = useFetch(url)
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

    const handleDelete = () => {
        fetch(`/api/v1/products/product/${deleteItem}/delete`, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Success') {
                console.log('Deleted')
                setOpenModal(false)
                setDeleteItem(null)
                window.location.reload()
            }
        })
    }

    return (
        <div className='page product_list'>
            {openModal && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            <MainNavbar />
            <main>
                <section className="summary">
                    <SummaryContainer data_to_show={apiData.length} text_to_show='Total Products'/>
                    <SummaryContainer />
                    <SummaryContainer />
                </section>
                <section className="product_list">
                    <div className="product-table">
                        <div className="product-table-title">All Products</div>
                        <div className="product-table-content">
                            <Table
                                mainData='product' 
                                header_array={['Image', 'Name', 'Type', 'Brand', 'Supplier', 'SKU', 'Content', 'Expire Date', 'Price', 'Discount', 'Store 1 Inventory', 'Store 2 Inventory', 'Store 3 Inventory']}
                                data_array={apiData}
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
        </div>
    )
}

export default ProductListPage