import Link from 'next/link'

const InventoryNavbar = ({}) => {
    return (
        <nav className='navbar inventory'>
            <Link href=''>Home</Link>
            <Link href=''>Search</Link>
            <Link href=''>Back</Link>
        </nav>
    )
}

export default InventoryNavbar