import React from 'react'
import '../styles/app.css'

const FileUpload = ({handleFileChange, handleUpload}) => {
    return (
        <div>
            <form onSubmit={handleUpload}>
                <input accept=".zip" type="file" onChange={handleFileChange}></input>
                <input type="submit" value="Upload"></input>
            </form>
        </div>

  )
}

export default FileUpload