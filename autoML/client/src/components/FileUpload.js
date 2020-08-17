import React from 'react'

const FileUpload = ({handleFileChange, handleUpload}) => {
    return (
        <form onSubmit={handleUpload}>
            <input accept=".zip" type="file" onChange={handleFileChange}></input>
            <input type="submit" value="Upload"></input>
        </form>
  )
}

export default FileUpload