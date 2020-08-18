import axios from "axios";
const baseUrl = "http://localhost:8080"

// Send post request to go server to upload file
const uploadFile = file => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${baseUrl}/upload`, formData, {
    onUploadProgress: progressEvent => {
      console.log('Upload Progress: ', progressEvent.loaded / progressEvent.total)
    }
  });
}

export default { uploadFile };
