import Link from "next/link"


const MainNavbar = ({}) => {
    return (
        <nav className='navbar main'>
            <Link href=''>Home</Link>
            <Link href=''>Search</Link>
            <Link href=''>Stores</Link>
            <Link href=''>Inventory</Link>
            <Link href=''>Products</Link>
            <Link href=''>Customers</Link>
            <Link href=''>Sales</Link>
            <Link href=''>Purchase</Link>
            <Link href=''>Supplier</Link>
            <Link href=''>Staff</Link>
        </nav>
    )
}

export default MainNavbar