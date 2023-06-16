import Link from 'react-router-dom'

const CustomerNavbar = () => {
    return (
        <nav className="navbar customer">
            <Link to='' className='navbar-item home'>Home</Link>
            <Link to=''>Search</Link>
            <Link to='' className='navbar-item back'>Back</Link>
        </nav>
    )
}

export default CustomerNavbar