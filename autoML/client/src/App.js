import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import fileService from "./services/fileService";
import PredictImage from "./components/PredictImage";
import UploadSuccess from "./components/UploadSuccess";
import TrainButton from "./components/TrainButton";
import "./styles/app.css";

const App = () => {
  const [fileOne, setFileOne] = useState("");
  const [filenameOne, setFilenameOne] = useState("");
  const [fileTwo, setFileTwo] = useState("");
  const [filenameTwo, setFilenameTwo] = useState("");
  const [classNames, setClassNames] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const handleFileChange = (event, setFile, setFilename) => {
    const newFile = event.target.files[0];
    if (newFile !== undefined) {
      setFile(newFile);
      setFilename(newFile.name);
    }
  };

  const handleUpload = (event, file) => {
    if (!file) {
      window.alert("Error: Please select a zip file to upload.");
      return;
    }
    event.preventDefault();
    console.log(file);
    setUploadSuccess(false);
    fileService.uploadFile(file).then(() => setUploadSuccess(true));
  };

  return (
    <div className="app-container">
      <h1> Welcome to AutoML</h1>
      <p>
        A web application that automatically trains a binary image classifier
        for two sets of images.
      </p>

      {/* TODO: Refactor file uploading into a React component  */}
      <div className="uploadFiles">
        <div className="classFiles">
          <h2>Upload Zip File for Class 1</h2>
          <FileUpload
            handleFileChange={(e) =>
              handleFileChange(e, setFileOne, setFilenameOne)
            }
            handleUpload={(e) => handleUpload(e, fileOne)}
          />
        </div>
        <div className="classFiles">
          <h2> Upload Zip File for Class 2</h2>
          <FileUpload
            handleFileChange={(e) =>
              handleFileChange(e, setFileTwo, setFilenameTwo)
            }
            handleUpload={(e) => handleUpload(e, fileTwo)}
          />
        </div>
      </div>

      <TrainButton
        fileOne={fileOne}
        fileTwo={fileTwo}
        filenameOne={filenameOne}
        filenameTwo={filenameTwo}
        setClassNames={setClassNames}
      ></TrainButton>
      <PredictImage classNames={classNames}></PredictImage>
      {uploadSuccess && <UploadSuccess></UploadSuccess>}
    </div>
  );
};

export default App;
