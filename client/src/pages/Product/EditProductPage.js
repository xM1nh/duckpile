import MainNavbar from "../../components/navbar/MainNavbar"
import './_EditProductPage.css'
import FormInput from '../../components/forms/FormInput'
import { useParams } from "react-router-dom"
import useFetch from '../../hooks/useFetch'
import { useEffect, useState } from "react"
import {v4 as uuidv4} from 'uuid'
import { useNavigate } from "react-router-dom"

const EditProductPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [mainImg, setMainImg] = useState(null)
    const [err, setErr] = useState(null)
    const product = useFetch(`/api/v1/products/product/${id}/update`)
    const supplier = useFetch('/api/v1/suppliers')
    const [info, setInfo] = useState({})

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch(`/api/v1/products/product/${id}/update`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(info)
        })
        .then(res => res.json())
        .then(data => {
            if (data.errors) {
                setErr(data.errors)
                console.log(err)
            } else if (data.message === 'Success') {
                console.log('Success')
                navigate(-1)
            }
        }).catch(err => console.error('Error uploading:', err))
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
        if (product.apiData.general) {
            setInfo(product.apiData.general)
        }
    }, [product.apiData.general])

    return (
        <div className="page edit-product">
            <MainNavbar />

            <main>
                <form onSubmit={handleSubmit}>

                    <div className="edit-product info">
                        <div className="edit-product-image-container">
                            <div className='image-list'>
                                {product.apiData.images && 
                                    product.apiData.images.map(image => {
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
                                defaultValue={info.product_name}/>
                            <div className="price">
                                <FormInput 
                                    id='edit-product-price' 
                                    label='Product Price' 
                                    input='price' 
                                    inputType='number' 
                                    handleChange={handleChange}
                                    defaultValue={info.price}
                                />
                                <FormInput 
                                    id='edit-product-discount' 
                                    label='Product Discount' 
                                    input='discount' 
                                    inputType='number' 
                                    handleChange={handleChange}
                                    defaultValue={info.discount}
                                />
                            </div>
                            
                            <FormInput 
                                id='edit-product-type' 
                                label='Product Type' 
                                input='type' 
                                handleChange={handleChange}
                                defaultValue={info.type}
                            />
                            <FormInput 
                                id='edit-product-content' 
                                label='Product Content' 
                                input='content' 
                                handleChange={handleChange}
                                defaultValue={info.content}
                            />
                            <FormInput 
                                id='edit-product-expDate' 
                                label='Expired Date' 
                                input='expired_date' 
                                inputType='date' 
                                handleChange={handleChange}
                                defaultValue={info.expired_date}
                            />

                            <div className="supplier">
                                <FormInput 
                                    id='edit-product-brand' 
                                    label='Product Brand' 
                                    input='brand' 
                                    handleChange={handleChange}
                                    defaultValue={info.brand}
                                />
                                <FormInput 
                                    id='edit-product-sku' 
                                    label='Product SKU' 
                                    input='sku' 
                                    handleChange={handleChange}
                                    defaultValue={info.sku}
                                />
                                <div className='edit-product-supplier'>
                                    <div>
                                        <label htmlFor='supplier_id'>Supplier:</label>
                                    </div>
                                    <select name='supplier_id' value={info.supplier} onChange={handleChange}>
                                        {supplier.apiData 
                                        && supplier.apiData.map((supplier, i) => {
                                            return (
                                                <option key={uuidv4()} value={supplier.supplier_id}>{supplier.supplier_name}</option> 
                                            )
                                        })
                                    }
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
                            defaultValue={info.inventory_store_1}
                        />
                        <FormInput 
                            id='edit-product-inventory' 
                            label='Store 2 Inventory' 
                            input='inventory_store_2' 
                            inputType='number' 
                            handleChange={handleChange} 
                            defaultValue={info.inventory_store_2}
                        />
                        <FormInput 
                            id='edit-product-inventory' 
                            label='Store 3 Inventory' 
                            input='inventory_store_3' 
                            inputType='number' 
                            handleChange={handleChange}
                            defaultValue={info.inventory_store_3}
                        />
                    </div>

                    <button type="submit">Save</button>
                </form>
            </main>
        </div>
    )
}

export default EditProductPage