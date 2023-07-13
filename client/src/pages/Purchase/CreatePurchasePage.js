import MainNavbar from '../../components/navbar/MainNavbar'
import './_CreatePurchasePage.css'
import { useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import Table from '../../components/container/Table'
import { useNavigate } from 'react-router-dom'

const CreatePurchasePage = () => {
    const navigate = useNavigate()
    const {isLoading, apiData, serverErr} = useFetch(`/api/v1/purchases/create`)

    const [suppliers, setSuppliers] = useState({
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
    const [staff, setStaff] = useState(null)
    const [date, setDate] = useState(null)
    const [dropDownOpen, setDropDownOpen] = useState({
        supplier: false,
        product: false,
        store: false
    })

    const openDropDown = (e) => {
        switch (e.target.dataset.dropdown) {
            case 'supplier':
                setDropDownOpen(prevState => ({
                    ...prevState,
                    supplier: true
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
            case 'supplier':
                setDropDownOpen(prevState => ({
                    ...prevState,
                    supplier: false
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
            case 'supplier': {
                const {name , value} = e.target
                setSuppliers(prevState => ({
                    ...prevState,
                    selected: {
                        ...prevState.selected,
                        [name]: value
                    }
                }))
                const searchVal = e.target.value.toLowerCase()
                setSuppliers(prevState => ({
                    ...prevState,
                    filtered: suppliers.original.filter(supplier => supplier.supplier_name.toLowerCase().includes(searchVal))
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
            case 'supplier': {
                const id = parseInt(e.target.dataset.id)
                const supplier = suppliers.original.find(supplier => supplier.supplier_id === id)
                setSuppliers(prevState => ({
                    ...prevState,
                    selected: {
                        id: id,
                        name: supplier.supplier_name,
                        phone: supplier.phone_number,
                        street: supplier.address ? supplier.address.split(', ')[0] : null,
                        city: supplier.address ? supplier.address.split(', ')[1] : null,
                        state: supplier.address ? supplier.address.split(', ')[2].split(' ')[0] : null,
                        zip: supplier.address ? supplier.address.split(', ')[2].split(' ')[1] : null
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
        const productID = e.target.id
        setProducts(prevState => ({
            ...prevState,
            allSelected: prevState.allSelected.filter(product => product.product_id !== productID)
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        const formData = {}
        for (const [key, value] of Object.entries(suppliers.selected)) {
            formData['supplier_' + key] =  value
        }
        formData['products'] = JSON.stringify(products.allSelected)
        for (const [key, value] of Object.entries(stores.selected)) {
            formData['store_' + key] =  value
        }
        formData['staff'] = staff
        formData['date'] = date
        formData['total'] = total

        console.log(formData)
        
        fetch(`/api/v1/purchases/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.message)
            navigate(`/purchase/${data.id}`)
        })
    }

    useEffect(() => {
        if (apiData) {
            setProducts(prevState => ({
                ...prevState,
                original: apiData.products
            }))
            setSuppliers(prevState => ({
                ...prevState,
                original: apiData.suppliers
            }))
            setStores(prevState => ({
                ...prevState,
                original: apiData.stores
            }))
        }
    }, [apiData])

    useEffect(() => {
        setTotal(products.allSelected.reduce((sum,curr) => {
            return sum + curr.priceTotal
        }, 0))
    }, [products.allSelected])

    return (
        <div className='page create-purchase'>
            <MainNavbar />

            <main>
                <form onSubmit={handleSubmit}>
                    <div className='supplier-info'>
                        <h1>Supplier Info</h1>
                        <div id='name'>
                            <label>Supplier Name</label>
                            <input value={suppliers.selected.name} onFocus={openDropDown} onBlur={closeDropDown} data-dropdown='supplier' onChange={handleChange} name='name'></input>
                            {
                            dropDownOpen.supplier && 
                                <div className='dropdown'>
                                    {suppliers.filtered.map(supplier => {
                                        return (
                                            <div onMouseDown={handleDropDownClick} data-dropdown='supplier' data-id={supplier.supplier_id} data-name={supplier.supplier_name}>{supplier.supplier_name} - {supplier.phone_number}</div>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                        <div id='phone'>
                            <label>Phone Number</label>
                            <input onChange={handleChange} value={suppliers.selected.phone} name='phone' data-dropdown='supplier'></input>
                        </div>
                        <div id='street'>
                            <label>Street</label>
                            <input onChange={handleChange} value={suppliers.selected.street} name='street' data-dropdown='supplier'></input>
                        </div>
                        <div id='city'>
                            <label>City</label>
                            <input onChange={handleChange} value={suppliers.selected.city} name='city' data-dropdown='supplier'></input>
                        </div>
                        <div id='state'>
                            <label>State</label>
                            <input onChange={handleChange} value={suppliers.selected.state} name='state' data-dropdown='supplier'></input>
                        </div>
                        <div id='zip'>
                            <label>Zip</label>
                            <input onChange={handleChange} value={suppliers.selected.zip} name='zip' data-dropdown='supplier'></input>
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

                    <div className='purchase-info'>
                        <h1>Purchase Info</h1>
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
                                            <div onMouseDown={handleDropDownClick} data-dropdown='store' data-id={store.id} data-name={store.name}>{store.name}</div>
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
        </div>
    )
}

export default CreatePurchasePage