import axios from "axios";
const baseUrl = "http://localhost:8080"

// Send a POST request to GoServer to train the model
const trainModel = (filenameOne, filenameTwo) => {
    const request = axios.post(`${baseUrl}/train/${filenameOne}/${filenameTwo}`)
    return request.then(response => response.data);
}

export default { trainModel };
