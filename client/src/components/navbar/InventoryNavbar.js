import Link from 'react-router-dom'

const InventoryNavbar = () => {
    return (
        <nav className='navbar inventory'>
            <Link to='' className='navbar-item home'>Home</Link>
            <Link to=''>Search</Link>
            <Link to=''>Back</Link>
        </nav>
    )
}

export default InventoryNavbar