import './_CreateSupplierPage.css'
import MainNavbar from '../../components/navbar/MainNavbar'
import FormInput from '../../components/forms/FormInput'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateSupplierPage = () => {
    const navigate = useNavigate()
    const [err, setErr] = useState(null)
    const [data, setData] = useState({
        name: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        zip: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch(`/api/v1/suppliers/create`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            if (data.errors) {
                setErr(data.errors)
                console.error(err)
            } else {
                console.log(data.message)
                navigate(`/supplier/${data.id}`)
            }
        })
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