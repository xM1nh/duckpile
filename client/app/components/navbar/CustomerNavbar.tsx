import Link from "next/link";

const CustomerNavbar = ({}) => {
    return (
        <nav className="navbar customer">
            <Link href=''>Home</Link>
            <Link href=''>Search</Link>
            <Link href=''>Back</Link>
        </nav>
    )
}

export default CustomerNavbar