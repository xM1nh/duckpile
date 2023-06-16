import Link from "next/link";

const ProductNavbar = ({}) => {
    return (
        <nav className="navbar product">
            <Link href=''>Home</Link>
            <Link href=''>Search</Link>
            <Link href=''>Back</Link>
        </nav>
    )
}

export default ProductNavbar