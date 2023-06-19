import { Link } from 'react-router-dom'
import './_Pagination.css'

const Pagination = ({url, currentPage, pageCount, handlePrev, handleNext, handlePage}) => {
    const generate = () => {
        var i = 1
        const temp = []

        while (i <= pageCount) {
            if (i <= 3 ||
                i >= pageCount - 2 ||
                (i >= currentPage - 1 && i <= currentPage + 1)) {
                    temp.push(<button onClick={handlePage} id={ i === currentPage ? 'current' : i}>{i}</button>)
                i++
            } else {
                i = i < currentPage ? currentPage - 1 : pageCount - 2
                temp.push(<div>...</div>)
            }
        }


        return temp
    }

    return (
        <nav className="pagination">
            <button className="pagination prev" onClick={handlePrev}>Prev</button>
            <div className="pagination-nav">
                {generate()}
            </div>
            <button className="pagination next" onClick={handleNext}>Next</button>
        </nav>
    )
}

export default Pagination