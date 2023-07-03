import './_FormInput.css'

const FormInput = ({id, label, input, inputType, placeholder, err, handleChange, defaultValue}) => {
    return (
        <div className="FormInput" id={id}>
            <div className='label'>
                <label htmlFor={input}>{label}</label>
            </div>
            <input 
                type={inputType ? inputType : 'text'} 
                name={input} 
                placeholder={placeholder}
                onChange={handleChange}
                defaultValue={defaultValue}>
            </input>
            {err && <p>*{err.message}</p>}
        </div>
    )
}

export default FormInput