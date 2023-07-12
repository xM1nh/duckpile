import MainNavbar from '../../components/navbar/MainNavbar'
import './_EditSalePage.css'
import { useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import Table from '../../components/container/Table'
import { useNavigate, useParams } from 'react-router-dom'

const EditSalePage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const {isLoading, apiData, serverErr} = useFetch(`/api/v1/sales/sale/${id}/update`)

    const [customers, setCustomers] = useState({
        original: [],
        filtered: [],
        selected: {}
    })
    const [products, setProducts] = useState({
        original: [],
        filtered: [],
        currSelected: {
            name: '',
            id: '',
            price: '',
            quantity: 1,
        },
        allSelected: []
    })
    const [total, setTotal] = useState(0)
    const [stores, setStores] = useState({
        original: [],
        filtered: [],
        selected: {}
    })
    const [paymentMethod, setPaymentMethod] = useState(null)
    const [staff, setStaff] = useState(null)
    const [date, setDate] = useState(null)
    const [dropDownOpen, setDropDownOpen] = useState({
        customer: false,
        product: false,
        store: false
    })

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
                    filtered: customers.original.filter(customer => customer.customer_name.toLowerCase().includes(searchVal))
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
                    filtered: products.original.filter(product => product.name.toLowerCase().includes(searchVal))
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
                    filtered: stores.original.filter(store => store.name.toLowerCase().includes(searchVal))
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
                const customer = customers.original.find(customer => customer.customer_id === id)
                setCustomers(prevState => ({
                    ...prevState,
                    selected: {
                        id: id,
                        name: customer.customer_name,
                        phone: customer.phone_number,
                        street: customer.address ? customer.address.split(', ')[0] : null,
                        city: customer.address ? customer.address.split(', ')[1] : null,
                        state: customer.address ? customer.address.split(', ')[2].split(' ')[0] : null,
                        zip: customer.address ? customer.address.split(', ')[2].split(' ')[1] : null
                    }
                }))
                break
            }
            case 'product': {
                const id = parseInt(e.target.dataset.id)
                const name = e.target.dataset.name
                const price = Number(e.target.dataset.price)
                setProducts(prevState => ({
                    ...prevState,
                    currSelected: {
                        ...prevState.currSelected,
                        name: name,
                        id: id,
                        price: price
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
        const found = products.allSelected.some(e => e.id === product.id)
        if (!found) {
            setProducts(prevState => ({
                ...prevState,
                allSelected: [...prevState.allSelected, productWithTotalAmount]
            }))
        } else {
            const idx = products.allSelected.findIndex(e => e.id === product.id)
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

    const handleSubmit = (e) => {
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
        
        fetch(`/api/v1/sales/sale/${id}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.message)
            navigate(`/sale/${id}`)
        })
    }

    useEffect(() => {
        if (apiData) {
            setProducts(prevState => ({
                ...prevState,
                original: apiData.products,
                allSelected: apiData.sale.products.map(product => {
                    const p = {
                        name: product.product_name,
                        id: product.product_id,
                        price: product.product_price,
                        quantity: product.quantity
                    }
                    const priceTotal = product.product_price * product.quantity
                    return {...p, priceTotal}
                })
            }))
            setCustomers(prevState => ({
                ...prevState,
                original: apiData.customers,
                selected: {
                    id: apiData.sale.customer.id,
                    name: apiData.sale.customer.firstName.concat(' ', apiData.sale.customer.lastName),
                    phone: apiData.sale.customer.phone,
                    street: apiData.sale.customer.street,
                    city: apiData.sale.customer.city,
                    state: apiData.sale.customer.state,
                    zip: apiData.sale.customer.zip
                }
            }))
            setStores(prevState => ({
                ...prevState,
                original: apiData.stores,
                selected: {
                    name: apiData.sale.store.name,
                    id: apiData.sale.store.id
                }
            }))
            setStaff(apiData.sale.staff)
            setDate(apiData.sale.date)
            setPaymentMethod(apiData.sale.paymentMethod)
        }
    }, [apiData])

    console.log(products.allSelected)

    useEffect(() => {
        setTotal(products.allSelected.reduce((sum,curr) => {
            return sum + curr.priceTotal
        }, 0))
    }, [products.allSelected])

    return (
        <div className='page edit-sale'>
            <MainNavbar />

            <main>
                <form onSubmit={handleSubmit}>
                    <div className='customer-info'>
                        <h1>Customer Info</h1>
                        <div id='name'>
                            <label>Customer Name</label>
                            <input value={customers.selected.name} onFocus={openDropDown} onBlur={closeDropDown} data-dropdown='customer' onChange={handleChange} name='name'></input>
                            {
                            dropDownOpen.customer && 
                                <div className='dropdown'>
                                    {customers.filtered.map(customer => {
                                        return (
                                            <div onMouseDown={handleDropDownClick} data-dropdown='customer' data-id={customer.customer_id} data-name={customer.customer_name}>{customer.customer_name} - {customer.phone_number}</div>
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
                            <Table header_array={['Product', 'Price per unit', 'Quantity', 'Total']} data_array={products.allSelected} mainData='product' handleDelete={handleDelete}/>
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
                                        {products.filtered.map(product => {
                                            return (
                                                <div onMouseDown={handleDropDownClick} data-id={product.id} data-name={product.name} data-price={product.price} data-dropdown='product'>{product.name}</div>
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
                            <select onChange={e => setPaymentMethod(e.target.value)} defaultValue={paymentMethod}>
                                <option value='cash'>Cash</option>
                                <option value='card'>Debit/Credit Card</option>
                                <option value='cheque'>Cheque</option>
                            </select>
                        </div>
                        <div id='staff'>
                            <label>Staff name</label>
                            <input type='text' defaultValue={staff} onChange={e => setStaff(e.target.value)} name='staff'></input>
                        </div>
                        <div id='store'>
                            <label>Store</label>
                            <input value={stores.selected.name} onFocus={openDropDown} onBlur={closeDropDown} data-dropdown='store' onChange={handleChange} name='store'></input>
                            {
                            dropDownOpen.store && 
                                <div className='dropdown'>
                                    {stores.filtered.map(store => {
                                        return (
                                            <div onMouseDown={handleDropDownClick} data-dropdown='store' data-id={store.id} data-name={store.name}>{store.name}</div>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                        <div id='date'>
                            <label>Date</label>
                            <input type='date' defaultValue={date} onChange={e => setDate(e.target.value)} name='date'></input>
                        </div>
                    </div>
                    <button className='submit' type='submit'>Save</button>
                </form>
            </main>
        </div>
    )
}

export default EditSalePage