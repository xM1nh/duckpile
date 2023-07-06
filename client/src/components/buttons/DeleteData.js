import DeleteIcon from '@mui/icons-material/Delete';
import './_MaterialButton.css'

const DeleteData = ({isDisplay, handleDelete}) => {
    if (isDisplay) {
        return (
            <div className='material-button del-data'>
                <button onClick={handleDelete}>
                    <DeleteIcon sx={{fontSize: 40, color: 'white'}}/>
                </button>
            </div>
        )
    }
}

export default DeleteData