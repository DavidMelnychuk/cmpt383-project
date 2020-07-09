import axios from "axios";
const baseUrl = "http://localhost:8080"

const uploadFile = file => {
    const formData = new FormData();
    formData.append('file', file);
        // TODO: Add try/catch, log error, 
    return axios.post(`${baseUrl}/upload`, formData, {
      onUploadProgress: progressEvent => {
        console.log(progressEvent.loaded / progressEvent.total)
      }
    });
}

export default {uploadFile};
