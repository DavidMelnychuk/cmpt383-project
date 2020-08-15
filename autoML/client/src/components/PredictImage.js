import React, {useState} from 'react';
import predictionService from "../services/predictionService"

// Code adapted from https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa

const PredictImage = () => {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const handleImageChange = (event, setImage, setImageURL) => {
    const newImage = event.target.files[0]
    const newImageURL = URL.createObjectURL(event.target.files[0]);
    if(newImage !== undefined){
      setImage(newImage)
      setImageURL(newImageURL)
    }
  }

  const predictImage = (event, image) => {
    event.preventDefault();
    // Makes a GET request to python flask server to preprocess image for the model
    // Python server then makes a GET request to Tensorflow serving REST API.
    // Returns response here. 
    predictionService.predictImage(image).then((response) => {
      console.log(response)
      console.log(response.data)
    })

  }

  return(
    <div>
      <h1> Upload a File to Test Model Prediction</h1>
      <div id="upload-predict-image">
        <form onSubmit={(e) => predictImage(e, image)} encType = "multipart/form-data">
          <input type="file" onChange={(e) => handleImageChange(e, setImage, setImageURL)} accept="image/*"></input>
          <input type="submit" value="Predict"></input>
        </form>
      </div>

      <div id="preview-image">
        {image ? (<img src={imageURL} alt="preview"></img>) : null }
        {/* <div id="pred-result" class="hidden"></div> */}
      </div>

    </div>
  )
}

export default PredictImage