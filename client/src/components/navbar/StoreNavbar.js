import Link from 'react-router-dom'

const StoreNavbar = () => {
    return (
        <nav className='navbar store'>
            <Link to='' className='navbar-item home'>Home</Link>
            <Link to=''>Search</Link>
            <Link to=''>Store 1</Link>
            <Link to=''>Store 2</Link>
            <Link to=''>Store 3</Link>
            <Link to=''>Back</Link>
        </nav>
    )
}

export default StoreNavbar