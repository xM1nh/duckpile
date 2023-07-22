import './_EditCustomerPage.css'

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { useGetCustomerQuery, useEditCustomerMutation } from '../../features/customers/customersApiSlice'

import FormInput from '../../components/forms/FormInput'
import MainNavbar from '../../components/navbar/MainNavbar'
import Spinner from '../../components/spinner/Spinner'

const EditCustomerPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const [info, setInfo] = useState({})

    const {
        data: customer,
        isLoading: customerIsLoading,
        isSuccess,
        isError,
        error
    } = useGetCustomerQuery(id)

    const [editCustomer, {isLoading}] = useEditCustomerMutation()

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
            await editCustomer(info).unwrap
            navigate(-1)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (customer) setInfo(customer.general)
    }, [customer])

    let content

    if (customerIsLoading) content = <Spinner />
    if (isSuccess) {
        content = 
                <main>
                    <form onSubmit={handleSubmit}>
                        <FormInput 
                            label='First name:' 
                            input='first_name' 
                            placeholder='First name' 
                            handleChange={handleChange}
                            defaultValue={customer.general.first_name}/>
                        <FormInput 
                            label='Last name:' 
                            input='last_name' 
                            placeholder='Last name' 
                            handleChange={handleChange}
                            defaultValue={customer.general.last_name}/>
                        <FormInput 
                            label='Phone Number' 
                            input='phone_number' 
                            inputType='number' 
                            placeholder='Phone number' 
                            handleChange={handleChange}
                            defaultValue={customer.general.phone_number}/>
                        <FormInput 
                            label='Street:' 
                            input='street' 
                            placeholder='Street' 
                            handleChange={handleChange}
                            defaultValue={customer.general.street}/>
                        <FormInput 
                            label='City:' 
                            input='city' 
                            placeholder='City' 
                            handleChange={handleChange}
                            defaultValue={customer.general.city}/>
                        <FormInput 
                            label='State:' 
                            input='state' 
                            placeholder='State' 
                            handleChange={handleChange}
                            defaultValue={customer.general.state}/>
                        <FormInput 
                            label='Zip:' 
                            input='zip' 
                            inputType='number' 
                            placeholder='Zip' 
                            handleChange={handleChange}
                            defaultValue={customer.general.zip}/>

                        <button type='submit'>Save</button>
                    </form>
                </main>
    }

    return (
        <div className='page edit-customer'>
            <MainNavbar />
            {content}
        </div>
    )
}

export default EditCustomerPage