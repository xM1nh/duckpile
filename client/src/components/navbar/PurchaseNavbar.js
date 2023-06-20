import {Link} from "react-router-dom";

const PurchaseNavbar = () => {
    return (
        <nav className="navbar purchase">
            <Link to='/' className='navbar-item home'>Home</Link>
            <Link to=''>Search</Link>
            <Link to=''>Back</Link>
        </nav>
    )
}

export default PurchaseNavbar