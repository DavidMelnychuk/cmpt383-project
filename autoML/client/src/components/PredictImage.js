import React, {useState} from 'react';
import predictionService from "../services/predictionService"

// Code adapted from https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa

const PredictImage = ({classNames}) => {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [predictedLabel, setPredictedLabel] = useState(null);
  const [predictionConfidience, setPredictionConfidence] = useState(null);

  const handleImageChange = (event, setImage, setImageURL) => {
    const newImage = event.target.files[0]
    const newImageURL = URL.createObjectURL(event.target.files[0]);
    if(newImage !== undefined){
      setImage(newImage)
      setImageURL(newImageURL)
    }
  }

  const predictImage = (event, image, setPredictedLabel, setPredictionConfidence) => {
    event.preventDefault();
    // Makes a GET request to python flask server to preprocess image for the model
    // Python server then makes a GET request to Tensorflow serving REST API.
    // Returns response here. 
    predictionService.predictImage(image).then((response) => {
      console.log('Response from predict API: ', response)
      const prediction = response.data[0]
      console.log(prediction)
      // console.log(prediction[0])
      let predictedClass = prediction[0]> prediction[1] ? 0 : 1;
      console.log(predictedClass)
      console.log(classNames)
      console.log(classNames[predictedClass])
      setPredictedLabel(classNames[predictedClass])
      setPredictionConfidence(100 * prediction[predictedClass].toFixed(2))
    })

  }

  return(
    <div>
      <h2>Test Model Prediction on New Image</h2>
      <div id="upload-predict-image">
        <form onSubmit={(e) => predictImage(e, image, setPredictedLabel, setPredictionConfidence)} encType = "multipart/form-data">
          <input type="file" onChange={(e) => handleImageChange(e, setImage, setImageURL)} accept="image/*"></input>
          <input type="submit" value="Predict"></input>
        </form>
      </div>

      <div id="preview-image">
        {predictedLabel ? (<p>Model predicts: {predictedLabel} with {predictionConfidience} % confidence.</p>) : null} 
        {image ? (<img src={imageURL} alt="preview"></img>) : null }
      </div>

    </div>
  )
}

export default PredictImage