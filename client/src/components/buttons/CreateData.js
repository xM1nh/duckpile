import {Link} from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import './_MaterialButton.css'

const CreateData = ({isDisplay, url}) => {
    if (isDisplay) {
        return (
            <div className='material-button add-data'>
                <Link to={url}>
                    <AddIcon sx={{fontSize: 40, color: 'white'}}/>
                </Link>
            </div>
        )
    }
}

export default CreateData