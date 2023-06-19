import { useState } from "react";

const usePagination = (itemNum, itemNumPerPage) => {
    const [currentPage, setCurrentpage] = useState(1)
    const pageCount = Math.ceil(itemNum / itemNumPerPage)

    const handlePrev = () => {
        setCurrentpage((p) => {
            if (p === 1) return p
            return p - 1
        })
    }

    const handleNext = () => {
        setCurrentpage((p) => {
            if (p === pageCount) return p
            return p + 1
        })
    }

    const handlePage = (e) => {
        setCurrentpage(Number(e.target.id))
    }

    return {currentPage, pageCount, handleNext, handlePrev, handlePage}
}

export default usePagination