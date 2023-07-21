import MainNavbar from "../../components/navbar/MainNavbar"
import Pagination from "../../components/pagination/Pagination"
import usePagination from "../../hooks/usePagination"
import './_ProductListPage.css'
import Table from "../../components/container/Table"
import SummaryContainer from "../../components/container/SummaryContainer"
import ButtonContainer from "../../components/buttons/ButtonContainer"
import DeleteModal from "../../components/modal/DeleteModal"
import { useEffect, useState} from "react"
import Spinner from "../../components/spinner/Spinner"
import { useGetProductsQuery } from "../../features/products/productsApiSlice"

const ProductListPage = () => { 
    const [count, setCount] = useState(0)
    const {currentPage, pageCount, handleNext, handlePrev, handlePage} = usePagination(count, 25)
    const {
        data: products,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetProductsQuery(currentPage)
    
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

    let content

    if (isLoading) content = <Spinner />

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

    useEffect(() => {
        if (products) setCount(products.ids.length)
    }, [products])

    return (
        <div className='page product_list'>
            {openModal && <DeleteModal handleCancelClick={closeModal} handleDeleteClick={handleDelete}/>}
            {isSuccess && <MainNavbar />}
            {content}
        </div>
    )
}

export default ProductListPage