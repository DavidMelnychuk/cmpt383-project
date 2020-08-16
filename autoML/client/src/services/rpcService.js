import axios from "axios";
const baseUrl = "http://localhost:8080"

const trainModel = (filenameOne, filenameTwo) => {
    const request = axios.post(`${baseUrl}/train/${filenameOne}/${filenameTwo}`)
    return request.then(response => response.data);
}

export default {trainModel};
