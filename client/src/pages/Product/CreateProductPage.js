import {useEffect, useState} from 'react'
import './_CreateProductForm.css'
import useFetch from '../../hooks/useFetch'
import FormInput from '../../components/forms/FormInput'
import MainNavBar from '../../components/navbar/MainNavbar'
import { useNavigate } from 'react-router-dom'

const CreateProductForm = () => {
    const {isLoading, apiData, serverErr} = useFetch('/api/v1/products/create')
    const navigate = useNavigate()
    const [mainImage, setMainImage] = useState(null)
    const [blob, setBlob] = useState([])
    const [err, setErr] = useState(null)
    const [info, setInfo] = useState({
        name: '',
        type: '',
        brand: '',
        sku: '',
        supplier: 1, //Default value for supplier is 1
        price: '',
        discount: '',
        expDate: '',
        content: '',
        store1_inv: 0,
        store2_inv: 0,
        store3_inv:0,
        imageData: []
    })

    const handleImageInput = (e) => {
        const dataRaw = []
        const dataBlob = []

        for (let i = 0; i < e.target.files.length; i++) {
            dataRaw.push(e.target.files[i])
            dataBlob.push(URL.createObjectURL(e.target.files[i]))
        }
        setMainImage(dataBlob[0])
        setBlob([...dataBlob])
        setInfo((prevState) => ({
            ...prevState,
            imageData: [...dataRaw]
        }))
    }

    const handleImageClick = (e) => {
        setMainImage(e.target.src)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData();
        for (const [key, value] of Object.entries(info)) {
            if (key === 'imageData') {
                info[key].forEach(img => formData.append(`images`, img))
            } else formData.append(key, value)
        }
            
        fetch('/api/v1/products/create', {
            method: 'POST',
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.errors) {
                setErr(data.errors)
                console.log(err)
            }
            else if (data.message === 'Success') {
                navigate(`/product/${data.productId}`)
            }
        })
    }

    useEffect(() => {
        setMainImage(null)
        setBlob([])
        setInfo({
            name: '',
            type: '',
            brand: '',
            sku: '',
            supplier: 1,
            price: '',
            discount: '',
            expDate: '',
            content: '',
            store1_inv: 0,
            store2_inv: 0,
            store3_inv:0,
            imageData: []
        })
    }, [])

    return (
        <div className='page create-product'>
            <MainNavBar />
            <div className="form-container create-product">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>

                    <div className='form-control upload'>
                        <div className='main-image-container'>
                            <img src={mainImage} alt=''></img>
                        </div>

                        <div className='product-image-list'>
                            {blob.map((url, i) => {
                                return (
                                    <img onClick={handleImageClick} src={url} alt='...' key={i}></img>
                                    )
                                }
                            )}
                        </div>
                        
                        <div className='product-image-input'>
                            <label htmlFor='product-image'>Choose product images:</label>
                            <input 
                                type='file' multiple
                                name='images'
                                accept='image/*'
                                onChange={handleImageInput}
                            ></input>
                        </div>
                    </div>
                    
                    <FormInput id='product-name' label='Product Name' input='name' placeholder='Product Name' handleChange={handleChange}/>
                    <FormInput id='product-type' label='Product Type' input='type' placeholder='Product Type' handleChange={handleChange}/>
                    <FormInput id='product-brand' label='Product Brand' input='brand' placeholder='Product Brand' handleChange={handleChange}/>
                    <FormInput id='product-sku' label='Product SKU' input='sku' placeholder='Product SKU' handleChange={handleChange}/>
                    
                    <div className='product-supplier'>
                        <label htmlFor='supplier'>Supplier:</label>
                        <select name='supplier' onChange={handleChange}>
                            {apiData 
                                && apiData.suppliers.map((supplier, i) => {
                                    return (
                                        <option value={supplier.supplier_id} key={i}>{supplier.supplier_name}</option>
                                    )
                                })}
                        </select>
                    </div>
                   
                    <FormInput id='product-date' label='Product Expired Date' input='expDate' inputType='date' placeholder='Product Expired Date' handleChange={handleChange}/>
                    <FormInput id='product-price' label='Product price' input='price' inputType='number' placeholder='Product Price' handleChange={handleChange}/>
                    <FormInput id='product-disc' label='Product Discount' input='discount' inputType='number' placeholder='Product Discount' handleChange={handleChange}/>
                    <FormInput id='product-content' label='Product Content' input='content' placeholder='Product Content' handleChange={handleChange}/>

                    <FormInput id='store1-inv' label='Store 1 Inventory' input='store1_inv' inputType='number' handleChange={handleChange}></FormInput>
                    <FormInput id='store2-inv' label='Store 2 Inventory' input='store2_inv' inputType='number' handleChange={handleChange}></FormInput>
                    <FormInput id='store3-inv' label='Store 3 Inventory' input='store3_inv' inputType='number' handleChange={handleChange}></FormInput>

                    <button className='product-create-submit' type='submit'>Create Product</button>
                </form>
            </div>
        </div>
    )
}

export default CreateProductForm