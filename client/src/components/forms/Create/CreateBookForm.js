import {useEffect, useState} from 'react'
import './_CreateBookForm.css'
import useFetch from '../../../hooks/useFetch'

const CreateBookForm = () => {
    const {isLoading, apiData, serverErr} = useFetch('/api/v1/suppliers')
    const [images, setImages] = useState([])
    const [mainImage, setMainImage] = useState(null)

    const handleChange = (e) => {
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

    useEffect(() => {
        setMainImage(null)
        setImages([])
    }, [])

    return (
        <div className="form-container create-book">
            <form action='/api/v1/product/create' method='POST'>
                <div className='form-controll upload'>
                    <div className='main-image-container'>
                        <img src={mainImage} alt='main'></img>
                    </div>

                    <div>
                        {images.map(url => {
                            return (
                                <img onClick={handleImageClick} src={url} alt='...'></img>
                                )
                            }
                        )}
                    </div>

                    <label htmlFor='product-image'></label>
                    <input 
                        type='file' multiple
                        name='product-image'
                        accept='image/*'
                        onChange={handleChange}
                    ></input>
                </div>

                <label htmlFor='name'>Name:</label>
                <input type='text' name='name' placeholder='Name' required='true'></input>

                <label htmlFor='type'>Type:</label>
                <input type='text' name='type' placeholder='Type'></input>

                <label htmlFor='brand'>Brand:</label>
                <input type='text' name='brand' placeholder='Brand'></input>

                <label htmlFor='sku'>SKU:</label>
                <input type='text' name='sku' placeholder='SKU'></input>
                
                <label htmlFor='supplier'>Supplier:</label>
                <select name='supplier'>
                    {apiData 
                        && apiData.map(supplier => {
                            return (
                                <option value={supplier.supplier_id}>{supplier.supplier_name}</option>
                            )
                        })}
                </select>

                <label htmlFor='content'>Content:</label>
                <input type='text' name='content' placeholder='Content'></input>

                <label htmlFor='expDate'>Expired Date:</label>
                <input type='date' name='expDate' placeholder='Expired Date'></input>

                <label htmlFor='price'>Price:</label>
                <input type='number' step='0.01' name='price' placeholder='Price' required='true'></input>

                <label htmlFor='discount'>Discount:</label>
                <input type='number' step='0.01' name='discount' placeholder='Discount'></input>
            </form>
        </div>
    )
}

export default CreateBookForm