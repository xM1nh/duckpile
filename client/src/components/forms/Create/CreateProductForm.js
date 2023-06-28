import {useEffect, useState} from 'react'
import './_CreateProductForm.css'
import useFetch from '../../../hooks/useFetch'
import FormInput from '../FormInput'
import MainNavBar from '../../navbar/MainNavbar'

const CreateProductForm = () => {
    const {isLoading, apiData, serverErr} = useFetch('/api/v1/suppliers')
    const [images, setImages] = useState([])
    const [mainImage, setMainImage] = useState(null)
    const [err, setErr] = useState(null)
    const [info, setInfo] = useState({
        name: '',
        type: '',
        brand: '',
        sku: '',
        supplier: '',
        price: '',
        discount: '',
        expDate: '',
        content: '',
    })


    const handleImageInput = (e) => {
        const temp = []

        for (let i = 0; i < e.target.files.length; i++) {
            temp.push(URL.createObjectURL(e.target.files[i]))
        }

        setMainImage(temp[0])
        setImages(images => [...images, ...temp])
    }

    const handleImageClick = (e) => {
        setMainImage(e.target.src)
    }

    const handleChange = (e) => {
        const { name, value} = e.target

        setInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        fetch('/api/v1/products/product/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        })
        .then(res => res.json())
        .then(data => {
            if (data.errors) {
                setErr(data.errors)
                console.log(err)
            }
            else console.log('Pog')
        }).catch(err => console.error('Error submitting:', err))
    }

    useEffect(() => {
        setMainImage(null)
        setImages([])
    }, [])

    return (
        <div className='page create-product'>
            <MainNavBar />
            <div className="form-container create-product">
                <form onSubmit={handleSubmit}>

                    <div className='form-control upload'>
                        <div className='main-image-container'>
                            <img src={mainImage} alt=''></img>
                        </div>

                        <div className='product-image-list'>
                            {images.map((url, i) => {
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
                                name='product-image'
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
                                && apiData.map((supplier, i) => {
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

                    <button className='product-create-submit' type='submit'>Create Product</button>
                </form>
            </div>
        </div>
    )
}

export default CreateProductForm