import { useEffect, useState } from "react"

const useFetch = (url, method, body) => {
    const [isLoading, setIsLoading] = useState(false)
    const [apiData, setApiData] = useState([])
    const [serverErr, setServerErr] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const res = await fetch(url, {
                    method: method,
                    body: body
                })
                if (!res.ok) throw new Error(res.statusText)
                const data = await res.json()
                setApiData(data)
                setIsLoading(false)
                setServerErr(null)
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