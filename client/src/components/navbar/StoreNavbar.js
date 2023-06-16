import Link from 'next/link'

const StoreNavbar = ({}) => {
    return (
        <nav className='navbar store'>
            <Link href=''>Home</Link>
            <Link href=''>Search</Link>
            <Link href=''>Store 1</Link>
            <Link href=''>Store 2</Link>
            <Link href=''>Store 3</Link>
            <Link href=''>Back</Link>
        </nav>
    )
}

export default StoreNavbar