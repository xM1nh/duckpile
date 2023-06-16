import Link from "next/link"

const SearchNavbar = ({}) => {
    return (
        <nav className="navbar search">
            <form action='' method='POST'>
                <label htmlFor='search-field'>Search Field</label>
                <input type='text' name='search-field' />

                <label htmlFor="location">Where</label>
                <input type='radio' name='location' required/>

                <button type='submit'>Search</button>
            </form>

            <Link href=''>Back</Link>
        </nav>
    )
}

export default SearchNavbar