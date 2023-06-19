import {Link} from "react-router-dom"

const ProductNavbar = () => {
    return (
        <nav className="navbar product">
            <Link to='/' className='navbar-item home'>Home</Link>
            <Link to=''>Search</Link>
            <Link to=''>Add Product</Link>
            <Link to=''>Back</Link>
        </nav>
    )
}

export default ProductNavbar