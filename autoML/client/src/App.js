import React, {useState} from 'react';
import FileUpload from './components/FileUpload';
import fileService from "./services/fileService"
import rpcService from "./services/rpcService"
import PredictImage from './components/PredictImage';
import SuccessSnackbar from './components/SuccessSnackbar';
import Button from '@material-ui/core/Button';
import AndroidIcon from '@material-ui/icons/Android';


import './app.css'

const App = () => {
  const [fileOne, setFileOne] = useState('');
  const [filenameOne, setFilenameOne] = useState('');
  const [fileTwo, setFileTwo] = useState('');
  const [filenameTwo, setFilenameTwo] = useState('');
  const [classNames, setClassNames] = useState([filenameOne, filenameTwo])
  const [success, setSuccess] = useState(false)

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
    setSuccess(false)
    fileService.uploadFile(file).then(()=> setSuccess(true));
  }
  
  const trainModel = (event, filenameOne, filenameTwo, setClassNames) => {
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
      setClassNames(response.class_names)
    })
  }

  return (
    <div>
      <h1> Welcome to AutoML</h1>
      <p>A web application which automatically trains a binary image classifier for two sets of images.</p>

      <div className="uploadFiles">
        <div className="classFiles">
          <h2>Upload Zip File for Class 1</h2>
          <FileUpload handleFileChange={(e) => handleFileChange(e, setFileOne, setFilenameOne)} handleUpload={(e) => handleUpload(e,fileOne)}/>
        </div>
        <div className="classFiles">
          <h2> Upload Zip File for Class 2</h2>
          <FileUpload handleFileChange={(e) => handleFileChange(e, setFileTwo, setFilenameTwo)} handleUpload={(e) => handleUpload(e, fileTwo)}/>
        </div>
      </div>

      <div id="train-button-wrapper">
      {/* <Button variant="contained">Default</Button> */}
        <Button size="small" variant="contained" startIcon={<AndroidIcon></AndroidIcon>} onClick={(e) => trainModel(e, filenameOne, filenameTwo, setClassNames)} disableElevation >Train Model</Button>
      </div>
      <PredictImage classNames={classNames}></PredictImage>
      {success && <SuccessSnackbar></SuccessSnackbar>}
    </div>
  );
}

export default App;
