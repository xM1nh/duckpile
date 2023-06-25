import {Link} from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';
import './_MaterialButton.css'

const DeleteData = ({isDisplay, url}) => {
    if (isDisplay) {
        return (
            <div className='material-button del-data'>
                <Link to={url}>
                    <DeleteIcon sx={{fontSize: 40, color: 'white'}}/>
                </Link>
            </div>
        )
    }
}

export default DeleteData