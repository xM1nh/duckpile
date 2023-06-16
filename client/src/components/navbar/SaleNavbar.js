import Link from "react-router-dom";

const SaleNavbar = () => {
    return (
        <nav className="navbar sale">
            <Link to='' className='navbar-item home'>Home</Link>
            <Link to=''>Search</Link>
            <Link to=''>Back</Link>
        </nav>
    )
}

export default SaleNavbar