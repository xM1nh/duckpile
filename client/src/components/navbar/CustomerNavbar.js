import Link from "next/link"

const CustomerNavbar = () => {
    return (
        <nav className="navbar customer">
            <Link to=''>Home</Link>
            <Link to=''>Search</Link>
            <Link to=''>Back</Link>
        </nav>
    )
}

export default CustomerNavbar