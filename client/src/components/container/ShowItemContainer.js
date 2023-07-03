import './_ShowItemContainer.css'

const ShowItemContainer = ({
        productName, 
        productImg, 
        showName, 
        showDate, 
        showPrice, 
        showContent
    }) => {
    return (
        <div className="show-item-container">
            <div className="item-name">{productName}</div>
            <div className="item-image"><img src={productImg} alt=''></img></div>
            <div className="show-name">{showName}</div>
            <div className="show-date">{showDate}</div>
            <div className="show-price">{showPrice}</div>
            <div className="show-content">{showContent}</div>
        </div>
    )
}

export default ShowItemContainer