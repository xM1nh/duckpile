import Link from "next/link";

const PurchaseNavbar = ({}) => {
    return (
        <nav className="navbar purchase">
            <Link href=''>Home</Link>
            <Link href=''>Search</Link>
            <Link href=''>Back</Link>
        </nav>
    )
}

export default PurchaseNavbar