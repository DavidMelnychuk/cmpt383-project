import axios from "axios";
const baseUrl = "http://localhost:5000"

// Send post request to python server to predict the image
const predictImage = image => {
  const formData = new FormData();
  formData.append('image', image);
  return axios.post(`${baseUrl}/predict`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export default { predictImage };
