import './_EditSupplierPage.css'
import FormInput from '../../components/forms/FormInput'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import MainNavbar from '../../components/navbar/MainNavbar'

const EditSupplierPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const supplier = useFetch(`/api/v1/suppliers/supplier/${id}/update`)
    const [info, setInfo] = useState({})
    const [err, setErr] = useState(null)

    const handleChange = (e) => {
        const {name, value} = e.target
        setInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch(`/api/v1/suppliers/supplier/${id}/update`, {
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
                console.log(data.errors)
            } else {
                console.log(data.messsage)
                navigate(`/supplier/${id}`)
            }
        })
    }

    useEffect(() => {
        if (supplier.apiData) {
            setInfo(supplier.apiData)
        }
    }, [supplier.apiData])

    return (
        <div className='page edit-supplier'>
            <MainNavbar />

            <main>
                <form onSubmit={handleSubmit}>
                    <FormInput 
                        label='Name:' 
                        input='name' 
                        placeholder='name' 
                        handleChange={handleChange}
                        defaultValue={info.name}/>
                    <FormInput 
                        label='Phone Number' 
                        input='phone_number' 
                        inputType='number' 
                        placeholder='Phone number' 
                        handleChange={handleChange}
                        defaultValue={info.phone_number}/>
                    <FormInput 
                        label='Street:' 
                        input='street' 
                        placeholder='Street' 
                        handleChange={handleChange}
                        defaultValue={info.street}/>
                    <FormInput 
                        label='City:' 
                        input='city' 
                        placeholder='City' 
                        handleChange={handleChange}
                        defaultValue={info.city}/>
                    <FormInput 
                        label='State:' 
                        input='state' 
                        placeholder='State' 
                        handleChange={handleChange}
                        defaultValue={info.state}/>
                    <FormInput 
                        label='Zip:' 
                        input='zip' 
                        inputType='number' 
                        placeholder='Zip' 
                        handleChange={handleChange}
                        defaultValue={info.zip}/>

                    <button type='submit'>Save</button>
                </form>
            </main>
        </div>
    )
}

export default EditSupplierPage