import './_CreateCustomerPage.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAddNewCustomerMutation } from '../../features/customers/customersApiSlice'

import MainNavbar from '../../components/navbar/MainNavbar'
import FormInput from '../../components/forms/FormInput'

const CreateCustomerPage = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        zip: ''
    })

    const [addNewCustomer, {isLoading}] = useAddNewCustomerMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await addNewCustomer(data).unwrap()
            navigate(`/customer/${response.id}`)
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
        <div className='page create-customer'>
            <MainNavbar />

            <main>
                <form onSubmit={handleSubmit}>
                    <h1>Add New Customer</h1>
                    <FormInput label='First name:' input='firstName' placeholder='First name' handleChange={handleChange}/>
                    <FormInput label='Last name:' input='lastName' placeholder='Last name' handleChange={handleChange}/>
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

export default CreateCustomerPage