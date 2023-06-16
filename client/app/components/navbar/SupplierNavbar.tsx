import Link from "next/link";

const SupplierNavbar = ({}) => {
    return (
        <nav className="navbar supplier">
            <Link href=''>Home</Link>
            <Link href=''>Search</Link>
            <Link href=''>Back</Link>
        </nav>
    )
}

export default SupplierNavbar