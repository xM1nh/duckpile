import './_DeleteModal.css'

const DeleteModal = ({handleDeleteClick, handleCancelClick}) => {
    return (
        <div className="modal background">
            <div className="modal container delete">
                <div className='title'>
                    <h1>Are you sure you want to delete this?</h1>
                </div>
                <div className='footer'>
                    <button onClick={handleDeleteClick}>Delete</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal