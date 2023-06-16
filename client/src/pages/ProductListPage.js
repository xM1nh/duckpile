import ProductNavbar from "../components/navbar/ProductNavbar"
import useFetch from '../hooks/useFetch'

const ProductListPage = () => { 

    return (
        <div className='page product_list'>
            <ProductNavbar />
            <main>
                <section className="summary"></section>
                <section className="product_list"></section>
            </main>
        </div>
    )
}

export default ProductListPage