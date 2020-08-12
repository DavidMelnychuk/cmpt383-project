import axios from "axios";
// TODO: Ideally this shouldn't be hardcoded and instead in an ENV variable
const baseUrl = "http://localhost:8080"

const trainModelRequest = () => {

        // TODO: Add try/catch, log error, 
    // return axios.post(`${baseUrl}/upload`, formData, {
    //   onUploadProgress: progressEvent => {
    //     console.log(progressEvent.loaded / progressEvent.total)
    //   }
    // });
}

export default {trainModelRequest};
