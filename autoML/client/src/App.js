import React, {useState} from 'react';
import FileUpload from './components/FileUpload';
import fileService from "./services/fileService"
import rpcService from "./services/rpcService"

const App = () => {
  const [fileOne, setFileOne] = useState('');
  const [filenameOne, setFilenameOne] = useState('');
  const [fileTwo, setFileTwo] = useState('');
  const [filenameTwo, setFilenameTwo] = useState('');

  const handleFileChange = (event, setFile, setFilename) => {
    const newFile = event.target.files[0];
    if(newFile !== undefined){
      setFile(newFile);
      setFilename(newFile.name);
    }
  }

  const handleUpload = (event, file) => {
    event.preventDefault();
    console.log(file);
    fileService.uploadFile(file);
  }

  const trainModel = (event, filenameOne, filenameTwo) => {
    // Makes a GET request to Go Server
    // Go Server makes a RPC Call to Python server. 
    // Python Server then downloads files from this server
    // Python server trains using those files.
    // Then serves an ML Model.
    // When done => Spinner logo finish.
    // Can then upload another Image. 
    //TODO: Nice to have error handling to prompt user if no files uploaded yet.
    event.preventDefault();
    rpcService.trainModel(filenameOne, filenameTwo).then((response) => {
      console.log(response)
    })

    console.log(event)
  }

  return (
    <div>
      <h1> Welcome to AutoML</h1>
      <h1>Upload your files for Class 1</h1>
      <FileUpload handleFileChange={(e) => handleFileChange(e, setFileOne, setFilenameOne)} handleUpload={(e) => handleUpload(e,fileOne)}/>
      <h1> Upload your files for Class 2</h1>
      <FileUpload handleFileChange={(e) => handleFileChange(e, setFileTwo, setFilenameTwo)} handleUpload={(e) => handleUpload(e, fileTwo)}/>
      <button type="button" onClick={(e) => trainModel(e, filenameOne, filenameTwo)}>Train Model</button>
    </div>
  );
}

export default App;
