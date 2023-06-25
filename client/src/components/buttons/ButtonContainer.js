import AddData from "./AddData"
import EditData from "./EditData"
import DeleteData from "./DeleteData"

import './_ButtonContainer.css'

const ButtonContainer = ({add, edit, del, addURL, editURL, delURL}) => {
    return (
        <div className="material-button-container">
            <DeleteData isDisplay={del} url={delURL} />
            <EditData isDisplay={edit} url={editURL}/>
            <AddData isDisplay={add} url={addURL}/>
        </div>
    )
}

export default ButtonContainer