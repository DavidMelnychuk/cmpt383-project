import axios from "axios";
const baseUrl = "http://localhost:8080"

// Ideally this shouldn't be a GET call but rather some sort of socket communication
const trainModel = () => {
    const request = axios.get(`${baseUrl}/train`)
    return request.then(response => response.data);
}

export default {trainModel};
