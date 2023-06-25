import {Link} from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import './_MaterialButton.css'

const EditData = ({isDisplay, url}) => {
    if (isDisplay) {
        return (
            <div className='material-button edit-data'>
                <Link to={url}>
                    <EditIcon sx={{fontSize: 40, color: 'white'}}/>
                </Link>
            </div>
        )
    }
}

export default EditData