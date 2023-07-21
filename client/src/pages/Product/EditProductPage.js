import MainNavbar from "../../components/navbar/MainNavbar"
import './_EditProductPage.css'
import FormInput from '../../components/forms/FormInput'
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import {v4 as uuidv4} from 'uuid'
import { useNavigate } from "react-router-dom"
import { useGetSuppliersQuery } from "../../features/suppliers/suppliersApiSlice"
import { useEditProductMutation, useGetProductQuery } from "../../features/products/productsApiSlice"

const EditProductPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [mainImg, setMainImg] = useState(null)
    const [img, setImg] = useState([])
    const [err, setErr] = useState(null)
    const [info, setInfo] = useState({})

    const [editProduct, {isLoading}] = useEditProductMutation()

    const {
        data: suppliers,
        isSuccess: suppliersIsSuccess,
    } = useGetSuppliersQuery()

    const {
        data: product,
        isLoading: productIsLoading,
        isSuccess: productIsSuccess,
        isError: productIsError,
        error: productError
    } = useGetProductQuery(id)

    let dropdown = []
    if (suppliersIsSuccess) {
        dropdown = suppliers.ids.map((id, i) => 
                            <option value={id} key={i}>
                                {suppliers.entities[id].supplier_name}
                            </option>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await editProduct(info)
            navigate(-1)
        } catch (err) {
            console.error(err)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }))
    }

    const handleImageClick = (e) => {
        setMainImg(e.target.src)
    }

    useEffect(() => {
        if (product) {
            const {image, ...rest} = product.general
            setInfo(rest)
        }
    }, [product])

    let content
    if (productIsSuccess) {
        content = <main>
                        <form onSubmit={handleSubmit}>
                            <div className="edit-product info">
                                <div className="edit-product-image-container">
                                    <div className='image-list'>
                                        { 
                                            product.images.map(image => {
                                                return (
                                                    <img key={uuidv4()} onClick={handleImageClick} src={`/${image}`} alt=''></img>
                                                )
                                            }
                                        )}
                                    </div>
                                    <div className='main-image'><img src={mainImg} alt=''></img></div>
                                </div>

                                <div className='edit-product-info-container'>
                                    <FormInput 
                                        id='edit-product-name' 
                                        label='Product Name' 
                                        input='product_name' 
                                        handleChange={handleChange} 
                                        defaultValue={product.general.product_name}/>
                                    <div className="price">
                                        <FormInput 
                                            id='edit-product-price' 
                                            label='Product Price' 
                                            input='price' 
                                            inputType='number' 
                                            handleChange={handleChange}
                                            defaultValue={product.general.price}
                                        />
                                        <FormInput 
                                            id='edit-product-discount' 
                                            label='Product Discount' 
                                            input='discount' 
                                            inputType='number' 
                                            handleChange={handleChange}
                                            defaultValue={product.general.discount}
                                        />
                                    </div>
                                    
                                    <FormInput 
                                        id='edit-product-type' 
                                        label='Product Type' 
                                        input='type' 
                                        handleChange={handleChange}
                                        defaultValue={product.general.type}
                                    />
                                    <FormInput 
                                        id='edit-product-content' 
                                        label='Product Content' 
                                        input='content' 
                                        handleChange={handleChange}
                                        defaultValue={product.general.content}
                                    />
                                    <FormInput 
                                        id='edit-product-expDate' 
                                        label='Expired Date' 
                                        input='expired_date' 
                                        inputType='date' 
                                        handleChange={handleChange}
                                        defaultValue={product.general.expired_date}
                                    />

                                    <div className="supplier">
                                        <FormInput 
                                            id='edit-product-brand' 
                                            label='Product Brand' 
                                            input='brand' 
                                            handleChange={handleChange}
                                            defaultValue={product.general.brand}
                                        />
                                        <FormInput 
                                            id='edit-product-sku' 
                                            label='Product SKU' 
                                            input='sku' 
                                            handleChange={handleChange}
                                            defaultValue={product.general.sku}
                                        />
                                        <div className='edit-product-supplier'>
                                            <div>
                                                <label htmlFor='supplier_id'>Supplier:</label>
                                            </div>
                                            <select name='supplier_id' value={product.general.supplier_id} onChange={handleChange}>
                                                <option value=''></option>
                                                {dropdown}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="edit-product inventory">
                                <FormInput 
                                    id='edit-product-inventory' 
                                    label='Store 1 Inventory' 
                                    input='inventory_store_1' 
                                    inputType='number' 
                                    handleChange={handleChange}
                                    defaultValue={product.general.inventory_store_1}
                                />
                                <FormInput 
                                    id='edit-product-inventory' 
                                    label='Store 2 Inventory' 
                                    input='inventory_store_2' 
                                    inputType='number' 
                                    handleChange={handleChange} 
                                    defaultValue={product.general.inventory_store_2}
                                />
                                <FormInput 
                                    id='edit-product-inventory' 
                                    label='Store 3 Inventory' 
                                    input='inventory_store_3' 
                                    inputType='number' 
                                    handleChange={handleChange}
                                    defaultValue={product.general.inventory_store_3}
                                />
                            </div>

                            <button type="submit">Save</button>
                        </form>
                    </main>
    }

    return (
        <div className="page edit-product">
            {productIsSuccess && <MainNavbar />}
            {content}
        </div>
    )
}

export default EditProductPage