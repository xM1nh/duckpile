import Link from "next/link";

const StaffNavbar = ({}) => {
    return (
        <nav className="navbar staff">
            <Link href=''>Home</Link>
            <Link href=''>Search</Link>
            <Link href=''>Back</Link>
        </nav>
    )
}

export default StaffNavbar