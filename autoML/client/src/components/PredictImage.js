import React, {useState} from 'react';
import predictionService from "../services/predictionService"

// Code adapted from https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa
// and https://github.com/mtobeiyf/keras-flask-deploy-webapp
const PredictImage = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event, setImage) => {
    const newImage = URL.createObjectURL(event.target.files[0]);
    if(newImage !== undefined){
      setImage(newImage)
    }
  }

  const predictImage = (event, image) => {
    event.preventDefault();
    // Makes a GET request to python flask server to preprocess image for the model
    // Python server then makes a GET request to Tensorflow serving REST API.
    // Returns response here. 

    predictionService.predictImage(image).then((response) => {
      console.log(response)
    })

  }

  return(
    <div>
      <h1> Upload a File to Test Model Prediction</h1>
      <div id="upload-predict-image">
        <input type="file" onChange={(e) => handleImageChange(e, setImage)} accept="image/*"></input>
      </div>
      
      <button type="button" onClick={(e) => predictImage(e, image)}>Predict Image</button>
      <div id="preview-image">
        {image ? (<img src={image} alt="preview"></img>) : null }
        <div id="pred-result" class="hidden"></div>

      </div>
    </div>
  )
}

export default PredictImage