import React, {useState} from 'react';
import FileUpload from './components/FileUpload';
import axios from "axios";

const App = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('');

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    if(newFile !== undefined){
      setFile(newFile);
      setFilename(newFile.name);
    }
  }

  const handleUpload = (event) => {
    event.preventDefault();
    console.log(file);
    console.log(filename)

    const formData = new FormData();
    formData.append('file', file);
    // TODO: Add try/catch, log error, extract URL to constant, add to service.
    axios.post("http://localhost:8080/upload", formData);
  }

  return (
    <div>
      <h1>Upload your files for Class 1</h1>
      {/* <FileUpload uploadFile = {uploadFile}/> */}
      <FileUpload handleFileChange={handleFileChange} handleUpload={handleUpload}/>
      <h1> Upload your files for Class 2</h1>
      <FileUpload handleFileChange={handleFileChange} handleUpload={handleUpload}/>
    </div>
  );
}

export default App;
