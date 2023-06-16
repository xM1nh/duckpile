import Link from "next/link";

const SaleNavbar = ({}) => {
    return (
        <nav className="navbar sale">
            <Link href=''>Home</Link>
            <Link href=''>Search</Link>
            <Link href=''>Back</Link>
        </nav>
    )
}

export default SaleNavbar