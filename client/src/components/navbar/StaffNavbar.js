import Link from "react-router-dom";

const StaffNavbar = () => {
    return (
        <nav className="navbar staff">
            <Link to='' className='navbar-item home'>Home</Link>
            <Link to=''>Search</Link>
            <Link to=''>Back</Link>
        </nav>
    )
}

export default StaffNavbar