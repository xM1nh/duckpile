import { Link } from "react-router-dom"
import './_SummaryContainer.css'

const SummaryContainer = ({data_to_show, text_to_show, isLoading, serverErr}) => {

    if (isLoading) {
        return (<div className="container-loading">Loading</div>)
    }

    else if (serverErr) {
        return (<div className="container-error">Error: {serverErr}</div>)
    }

    else {
        return (
            <div className="container summary success">
                <div className="container-data value summary">{data_to_show}</div>
                <div className="container-data key summary">{text_to_show}</div>
                <Link to=''>
                    <div className="container-button summary">
                        <p>More Detail</p>
                    </div>
                </Link>
            </div>
        )
    }
}

export default SummaryContainer