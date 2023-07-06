import CreateData from "./CreateData"
import EditData from "./EditData"
import DeleteData from "./DeleteData"

import './_ButtonContainer.css'

const ButtonContainer = ({create, edit, del, createURL, editURL, handleDelete}) => {
    return (
        <div className="material-button-container">
            <DeleteData isDisplay={del} handleDelete={handleDelete} />
            <EditData isDisplay={edit} url={editURL}/>
            <CreateData isDisplay={create} url={createURL}/>
        </div>
    )
}

export default ButtonContainer