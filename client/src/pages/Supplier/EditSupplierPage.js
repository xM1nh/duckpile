import './_EditSupplierPage.css'

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { useGetSupplierQuery, useEditSupplierMutation } from '../../features/suppliers/suppliersApiSlice'

import FormInput from '../../components/forms/FormInput'
import MainNavbar from '../../components/navbar/MainNavbar'
import Spinner from '../../components/spinner/Spinner'

const EditSupplierPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const [info, setInfo] = useState({})

    const {
        data: supplier,
        isLoading: supplierIsLoading,
        isSuccess,
        isError,
        error
    } = useGetSupplierQuery(id)

    const [editSupplier, {isLoading}] = useEditSupplierMutation()

    const handleChange = (e) => {
        const {name, value} = e.target
        setInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await editSupplier(info).unwrap
            navigate(-1)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (supplier) setInfo(supplier.general)
    }, [supplier])

    let content

    if (supplierIsLoading) content = <Spinner />
    if (isSuccess) {
        content = 
                <main>
                    <form onSubmit={handleSubmit}>
                        <FormInput 
                            label='Name:' 
                            input='name' 
                            placeholder='Name' 
                            handleChange={handleChange}
                            defaultValue={supplier.general.name}/>
                        <FormInput 
                            label='Phone Number' 
                            input='phone_number' 
                            inputType='number' 
                            placeholder='Phone number' 
                            handleChange={handleChange}
                            defaultValue={supplier.general.phone_number}/>
                        <FormInput 
                            label='Street:' 
                            input='street' 
                            placeholder='Street' 
                            handleChange={handleChange}
                            defaultValue={supplier.general.street}/>
                        <FormInput 
                            label='City:' 
                            input='city' 
                            placeholder='City' 
                            handleChange={handleChange}
                            defaultValue={supplier.general.city}/>
                        <FormInput 
                            label='State:' 
                            input='state' 
                            placeholder='State' 
                            handleChange={handleChange}
                            defaultValue={supplier.general.state}/>
                        <FormInput 
                            label='Zip:' 
                            input='zip' 
                            inputType='number' 
                            placeholder='Zip' 
                            handleChange={handleChange}
                            defaultValue={supplier.general.zip}/>

                        <button type='submit'>Save</button>
                    </form>
                </main>
    }

    return (
        <div className='page edit-supplier'>
            <MainNavbar />
            {content}
        </div>
    )
}

export default EditSupplierPage