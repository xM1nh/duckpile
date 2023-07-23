import './_CreateSupplierPage.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAddNewSupplierMutation } from '../../features/suppliers/suppliersApiSlice'

import MainNavbar from '../../components/navbar/MainNavbar'
import FormInput from '../../components/forms/FormInput'

const CreateSupplierPage = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        zip: ''
    })

    const [addNewSupplier, {isLoading}] = useAddNewSupplierMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await addNewSupplier(data).unwrap()
            navigate(`/supplier/${response.id}`)
        } catch (err) {
            console.error(err)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }))
    }

    return (
        <div className='page create-supplier'>
            <MainNavbar />

            <main>
                <form onSubmit={handleSubmit}>
                    <h1>Add New Supplier</h1>
                    <FormInput label='Name:' input='name' placeholder='Name' handleChange={handleChange}/>
                    <FormInput label='Phone Number' input='phoneNumber' inputType='number' placeholder='Phone number' handleChange={handleChange}/>
                    <FormInput label='Street:' input='street' placeholder='Street' handleChange={handleChange}/>
                    <FormInput label='City:' input='city' placeholder='City' handleChange={handleChange}/>
                    <FormInput label='State: ' input='state' placeholder='State' handleChange={handleChange}/>
                    <FormInput label='Zip:' input='zip' inputType='number' placeholder='Zip' handleChange={handleChange}/>

                    <button type='submit'>Add</button>
                </form>
            </main>
        </div>
    )
}

export default CreateSupplierPage