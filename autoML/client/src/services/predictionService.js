import axios from "axios";
// TODO: Ideally this shouldn't be hardcoded and instead in an ENV variable
const baseUrl = "http://localhost:5000"

const predictImage = image => {
    const formData = new FormData();
    formData.append('image', image);
        // TODO: Add try/catch, log error, 
    return axios.post(`${baseUrl}/predict`, formData, {
      headers : {
        'Content-Type': 'multipart/form-data'
      }
    });
}

export default {predictImage};
