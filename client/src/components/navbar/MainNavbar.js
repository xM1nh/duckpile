import {Link} from "react-router-dom"


const MainNavbar = () => {
    return (
        <nav className='navbar main'>
            <Link to='/home' className='navbar-item home'>Home</Link>
            <Link to=''>Search</Link>
            <Link to='/inventory'>Inventory</Link>
            <Link to='/products'>Products</Link>
            <Link to='/customers'>Customers</Link>
            <Link to='/sales'>Sales</Link>
            <Link to='/purchases'>Purchase</Link>
            <Link to='/suppliers'>Supplier</Link>
        </nav>
    )
}

export default MainNavbar