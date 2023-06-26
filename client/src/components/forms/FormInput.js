import './_FormInput.css'

const FormInput = ({id, label, input, inputType, placeholder, err, handleChange}) => {
    return (
        <div className="FormInput" id={id}>
            <label htmlFor={input}>{label}</label>
            <input 
                type={inputType ? inputType : 'text'} 
                name={input} 
                placeholder={placeholder}
                onChange={handleChange}>
            </input>
            {err && <p>*{err.message}</p>}
        </div>
    )
}

export default FormInput