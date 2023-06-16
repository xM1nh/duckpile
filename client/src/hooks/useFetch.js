import { useEffect, useState } from "react"

const useFetch = (url) => {
    const [isLoading, setIsLoading] = useState(false)
    const [apiData, setApiData] = useState([])
    const [serverErr, setServerErr] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            try {
                const data = await fetch(url).then(res => res.json())

                setApiData(data)
                setIsLoading(false)
            } catch (err) {
                setServerErr(err)
                setIsLoading(false)
            }
        }

        fetchData()
    }, [url])

    return { isLoading, apiData, serverErr }
}

export default useFetch