import {Link} from "react-router-dom"


const MainNavbar = () => {
    return (
        <nav className='navbar main'>
            <Link to='' className='navbar-item home'>Home</Link>
            <Link to=''>Search</Link>
            <Link to=''>Stores</Link>
            <Link to=''>Inventory</Link>
            <Link to='/products'>Products</Link>
            <Link to=''>Customers</Link>
            <Link to=''>Sales</Link>
            <Link to=''>Purchase</Link>
            <Link to=''>Supplier</Link>
            <Link to=''>Staff</Link>
        </nav>
    )
}

export default MainNavbar