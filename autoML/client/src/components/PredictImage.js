import React, { useState } from 'react';
import predictionService from "../services/predictionService"
import LoadingOverlay from 'react-loading-overlay';

// Code adapted from https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa

const PredictImage = ({ classNames }) => {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [predictedLabel, setPredictedLabel] = useState(null);
  const [predictionConfidience, setPredictionConfidence] = useState(null);
  const [predicting, setPredicting] = useState(false);

  const handleImageChange = (event, setImage, setImageURL) => {
    const newImage = event.target.files[0]
    if (newImage !== undefined) {
      const newImageURL = URL.createObjectURL(event.target.files[0]);
      setImage(newImage)
      setImageURL(newImageURL)
    }
  }

  const predictImage = (event, image, setPredictedLabel, setPredictionConfidence) => {
    event.preventDefault();
    if (!image) {
      window.alert("Error: Please select an image file to predict.")
      return;
    }
    if (!classNames) {
      window.alert("Error: Please upload zip files and train a model before predicting.")
      return;
    }
    // Makes a GET request to python flask server to preprocess image for the model
    // Python server then makes a GET request to Tensorflow serving REST API.
    // Returns prediction here 
    setPredicting(true);
    predictionService.predictImage(image).then((response) => {
      console.log('Response from predict API: ', response)

      const prediction = response.data[0]
      let predictedClass = prediction[0] > prediction[1] ? 0 : 1;
      console.log(prediction)

      setPredicting(false);
      setPredictedLabel(classNames[predictedClass])
      setPredictionConfidence(100 * prediction[predictedClass].toFixed(2))

      console.log(predictedLabel)
    })
  }

  return (
    <div id="predict-image-container">
      <h2>Test Model Prediction on New Image</h2>
      <div id="upload-predict-image">
        <form onSubmit={(e) => predictImage(e, image, setPredictedLabel, setPredictionConfidence)} encType="multipart/form-data">
          <input type="file" onChange={(e) => handleImageChange(e, setImage, setImageURL)} accept="image/*"></input>
          <input type="submit" value="Predict"></input>
        </form>
      </div>

      <LoadingOverlay spinner active={predicting} text='Predicting...'>
        <div id="preview-image">
          {predictedLabel ? (<strong>Model predicts: {predictedLabel} with {predictionConfidience} % confidence.</strong>) : null}
          {image ? (<img src={imageURL} alt="preview" width="150" height="150"></img>) : null}
        </div>
      </LoadingOverlay>
    </div>
  )
}

export default PredictImage