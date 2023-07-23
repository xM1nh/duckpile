import './_CreateSalePage.css'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGetProductsQuery } from '../../features/products/productsApiSlice'
import { useGetCustomersQuery } from '../../features/customers/customersApiSlice'
import { useAddNewSaleMutation } from '../../features/sales/salesApiSlice'

import MainNavbar from '../../components/navbar/MainNavbar'
import Table from '../../components/container/Table'
import Spinner from '../../components/spinner/Spinner'

const CreateSalePage = () => {
    const navigate = useNavigate()

    const [customers, setCustomers] = useState({
        filtered: [],
        selected: {}
    })
    const [products, setProducts] = useState({
        filtered: [],
        currSelected: {
            name: '',
            product_id: '',
            price: '',
            quantity: 1,
        },
        allSelected: []
    })
    const [total, setTotal] = useState(0)
    const [stores, setStores] = useState({
        original: [
            {name: 'Store 1', id: 1},
            {name: 'Store 2', id: 2},
            {name: 'Store 3', id: 3}
        ],
        filtered: [],
        selected: {}
    })
    const [paymentMethod, setPaymentMethod] = useState('cash') //default value for payment method
    const [staff, setStaff] = useState(null)
    const [date, setDate] = useState(null)
    const [dropDownOpen, setDropDownOpen] = useState({
        customer: false,
        product: false,
        store: false
    })

    const {
        data: productsApi,
        isLoading: productsApiIsLoading,
        isSuccess: productsApiIsSuccess
    } = useGetProductsQuery({page: undefined, count: undefined})

    const {
        data: customersApi,
        isLoading: customersApiIsLoading,
        isSuccess: customersApiIsSuccess
    } = useGetCustomersQuery({page: undefined, count: undefined})

    const [addNewSale, {isLoading: addSaleIsLoading}] = useAddNewSaleMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const formData = {}
        for (const [key, value] of Object.entries(customers.selected)) {
            formData['customer_' + key] =  value
        }
        formData['products'] = JSON.stringify(products.allSelected)
        for (const [key, value] of Object.entries(stores.selected)) {
            formData['store_' + key] =  value
        }
        formData['staff'] = staff
        formData['date'] = date
        formData['payment_method'] = paymentMethod
        formData['total'] = total
        
        if (!addSaleIsLoading) {
            try {
                const response = await addNewSale(formData).unwrap()
                navigate(`/sale/${response.id}`)
            } catch (err) {
                console.error(err)
            }
        } else {
            console.log('wait')
        }
    }

    useEffect(() => {
        setTotal(products.allSelected.reduce((sum,curr) => {
            return sum + curr.priceTotal
        }, 0))
    }, [products.allSelected])

    let content

    if (productsApiIsLoading || customersApiIsLoading) content = <Spinner />
    if (productsApiIsSuccess && customersApiIsSuccess) {
        const openDropDown = (e) => {
            switch (e.target.dataset.dropdown) {
                case 'customer':
                    setDropDownOpen(prevState => ({
                        ...prevState,
                        customer: true
                    }))
                    break
                case 'product':
                    setDropDownOpen(prevState => ({
                        ...prevState,
                        product: true
                    }))
                    break
                case 'store':
                    setDropDownOpen(prevState => ({
                        ...prevState,
                        store: true
                    }))
                    break
                default: //do nothing
            }
        }
    
        const closeDropDown = (e) => {
            switch (e.target.dataset.dropdown) {
                case 'customer':
                    setDropDownOpen(prevState => ({
                        ...prevState,
                        customer: false
                    }))
                    break
                case 'product':
                    setDropDownOpen(prevState => ({
                        ...prevState,
                        product: false
                    }))
                    break
                case 'store':
                    setDropDownOpen(prevState => ({
                        ...prevState,
                        store: false
                    }))
                    break
                default: //do nothing
            }
        }
    
        const handleChange = (e) => {
            switch (e.target.dataset.dropdown) {
                case 'customer': {
                    const {name , value} = e.target
                    setCustomers(prevState => ({
                        ...prevState,
                        selected: {
                            ...prevState.selected,
                            [name]: value
                        }
                    }))
                    const searchVal = e.target.value.toLowerCase()
                    setCustomers(prevState => ({
                        ...prevState,
                        filtered: customersApi.ids.filter(id => 
                            customersApi.entities[id].customer_name
                                .toLowerCase()
                                .includes(searchVal))
                    }))
                    break
                }
                case 'product': {
                    setProducts(prevState => ({
                        ...prevState,
                        currSelected: {
                            ...prevState.currSelected,
                            name: e.target.value
                        }
                    }))
                    const searchVal = e.target.value.toLowerCase()
                    setProducts(prevState => ({
                        ...prevState,
                        filtered: productsApi.ids.filter(id => 
                            productsApi.entities[id].product_name
                                .toLowerCase()
                                .includes(searchVal))
                    }))
                    break
                }
                case 'quantity': {
                    setProducts(prevState => ({
                        ...prevState,
                        currSelected: {
                            ...prevState.currSelected,
                            quantity: parseInt(e.target.value)
                        }
                    }))
                    break
                }
                case 'store': {
                    setStores(prevState => ({
                        ...prevState,
                        selected: {
                            ...prevState.selected,
                            name: e.target.value
                        }
                    }))
                    const searchVal = e.target.value.toLowerCase()
                    setStores(prevState => ({
                        ...prevState,
                        filtered: stores.original.filter(store => 
                            store.name
                                .toLowerCase()
                                .includes(searchVal))
                    }))
                    break
                }
                default: //do nothing
            }
        }
    
        const handleDropDownClick = (e) => {
            switch (e.target.dataset.dropdown) {
                case 'customer': {
                    const id = parseInt(e.target.dataset.id)
                    setCustomers(prevState => ({
                        ...prevState,
                        selected: {
                            id: id,
                            name: customersApi.entities[id].customer_name,
                            phone: customersApi.entities[id].phone_number,
                            street: customersApi.entities[id].address 
                                ? customersApi.entities[id].address.split(', ')[0] 
                                : null,
                            city: customersApi.entities[id].address 
                                ? customersApi.entities[id].address.split(', ')[1] 
                                : null,
                            state: customersApi.entities[id].address 
                                ? customersApi.entities[id].address.split(', ')[2].split(' ')[0] 
                                : null,
                            zip: customersApi.entities[id].address 
                            ? customersApi.entities[id].address.split(', ')[2].split(' ')[1] 
                            : null
                        }
                    }))
                    break
                }
                case 'product': {
                    const id = parseInt(e.target.dataset.id)
                    setProducts(prevState => ({
                        ...prevState,
                        currSelected: {
                            ...prevState.currSelected,
                            name: productsApi.entities[id].product_name,
                            product_id: productsApi.entities[id].product_id,
                            price: productsApi.entities[id].price
                        }
                    }))
                    break
                }
                case 'store': {
                    const id = parseInt(e.target.dataset.id)
                    const name = e.target.dataset.name
                    setStores(prevState => ({
                        ...prevState,
                        selected: {name, id}
                    }))
                    break
                }
                default: //do nothing
            }
        }
    
        const handleProductAdd = () => {
            const product = products.currSelected
            const productWithTotalAmount = {...product, priceTotal: Number(product.price) * product.quantity}
            const found = products.allSelected.some(e => e.product_id === product.product_id)
            if (!found) {
                setProducts(prevState => ({
                    ...prevState,
                    allSelected: [...prevState.allSelected, productWithTotalAmount]
                }))
            } else {
                const idx = products.allSelected.findIndex(e => e.product_id === product.product_id)
                setProducts(prevState => ({
                    ...prevState,
                    allSelected: prevState.allSelected.map((p, i) => {
                        if (i === idx) {
                            return {
                                ...p,
                                quantity: p.quantity + product.quantity,
                                priceTotal: p.priceTotal + product.quantity * Number(product.price)
                            }
                        } else {
                            return p
                        }
                    })
                }))
            }
        }
    
        const handleDelete = (e) => {
            const productID = parseInt(e.target.id)
            setProducts(prevState => ({
                ...prevState,
                allSelected: prevState.allSelected.filter(product => product.product_id !== productID)
            }))
        }

        content = 
                <main>
                    <form encType="multipart/form-data" onSubmit={handleSubmit}>
                        <div className='customer-info'>
                            <h1>Customer Info</h1>
                            <div id='name'>
                                <label>Customer Name</label>
                                <input value={customers.selected.name} onFocus={openDropDown} onBlur={closeDropDown} data-dropdown='customer' onChange={handleChange} name='name'></input>
                                {
                                dropDownOpen.customer && 
                                    <div className='dropdown'>
                                        {customers.filtered.map(id => {
                                            return (
                                                <div 
                                                    onMouseDown={handleDropDownClick} 
                                                    data-dropdown='customer' 
                                                    data-id={id}>
                                                        {customersApi.entities[id].customer_name} - {customersApi.entities[id].phone_number}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </div>
                            <div id='phone'>
                                <label>Phone Number</label>
                                <input onChange={handleChange} value={customers.selected.phone} name='phone' data-dropdown='customer'></input>
                            </div>
                            <div id='street'>
                                <label>Street</label>
                                <input onChange={handleChange} value={customers.selected.street} name='street' data-dropdown='customer'></input>
                            </div>
                            <div id='city'>
                                <label>City</label>
                                <input onChange={handleChange} value={customers.selected.city} name='city' data-dropdown='customer'></input>
                            </div>
                            <div id='state'>
                                <label>State</label>
                                <input onChange={handleChange} value={customers.selected.state} name='state' data-dropdown='customer'></input>
                            </div>
                            <div id='zip'>
                                <label>Zip</label>
                                <input onChange={handleChange} value={customers.selected.zip} name='zip' data-dropdown='customer'></input>
                            </div>
                        </div>

                        <div className='product-info'>
                            <h1>Details</h1>
                            <div className='list-section'>
                                <Table 
                                    header_array={['Product', 'Price per unit', 'Quantity', 'Total']} 
                                    data_array={products.allSelected} 
                                    mainData='product' 
                                    handleDelete={handleDelete}/>
                                <div className='total'>
                                    <div className='title'>Total</div>
                                    <div className='amount'>{total}</div>
                                </div>
                            </div>
                            <div className='input-section'>
                                <div className='product-selection'>
                                    <label>Product Name</label>
                                    <input onChange={handleChange} onFocus={openDropDown} onBlur={closeDropDown} name='product' data-dropdown='product' value={products.currSelected.name}></input>
                                    {dropDownOpen.product 
                                        && <div className='dropdown'>
                                            {products.filtered.map(id => {
                                                return (
                                                    <div 
                                                        onMouseDown={handleDropDownClick} 
                                                        data-id={id} 
                                                        data-dropdown='product'>
                                                            {productsApi.entities[id].product_name}
                                                    </div>
                                                )
                                            })}
                                    </div>}
                                </div>
                                <div className='quantity-selection'>
                                    <label>Quantity</label>
                                    <input name='quantity' onChange={handleChange} defaultValue={1} type='number' data-dropdown='quantity'></input>
                                </div>
                                <button className='add' onClick={handleProductAdd} type='button'>Add</button>
                            </div>
                        </div>

                        <div className='sale-info'>
                            <h1>Sale Info</h1>
                            <div id='payment'>
                                <label>Payment Type</label>
                                <select onChange={e => setPaymentMethod(e.target.value)} defaultValue='cash'>
                                    <option value='cash'>Cash</option>
                                    <option value='card'>Debit/Credit Card</option>
                                    <option value='cheque'>Cheque</option>
                                </select>
                            </div>
                            <div id='staff'>
                                <label>Staff name</label>
                                <input type='text' onChange={e => setStaff(e.target.value)} name='staff'></input>
                            </div>
                            <div id='store'>
                                <label>Store</label>
                                <input value={stores.selected.name} onFocus={openDropDown} onBlur={closeDropDown} data-dropdown='store' onChange={handleChange} name='store'></input>
                                {
                                dropDownOpen.store && 
                                    <div className='dropdown'>
                                        {stores.filtered.map(store => {
                                            return (
                                                <div 
                                                    onMouseDown={handleDropDownClick} 
                                                    data-dropdown='store' 
                                                    data-id={store.id}
                                                    data-name={store.name} >
                                                        {store.name}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </div>
                            <div id='date'>
                                <label>Date</label>
                                <input type='date' onChange={e => setDate(e.target.value)} name='date'></input>
                            </div>
                        </div>
                        <button className='submit' type='submit'>Create</button>
                    </form>
                </main>
    }

    return (
        <div className='page create-sale'>
            <MainNavbar />
            {content}
        </div>
    )
}

export default CreateSalePage