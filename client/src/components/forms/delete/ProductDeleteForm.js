const ProductDeleteForm = ({productID}) => {
    return (
        <form action={`/product/${productID}/delete`} method='POST'>
            <p>Are you sure you want to delete this product?</p>
            <button type="submit">Delete</button>
            <button type="button">Cancel</button>
        </form>
    )
}

export default ProductDeleteForm