import Link from "react-router-dom";

const SupplierNavbar = () => {
    return (
        <nav className="navbar supplier">
            <Link to='' className='navbar-item home'>Home</Link>
            <Link to=''>Search</Link>
            <Link to=''>Back</Link>
        </nav>
    )
}

export default SupplierNavbar