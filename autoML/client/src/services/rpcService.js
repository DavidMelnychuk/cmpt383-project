import axios from "axios";
// TODO: Ideally this shouldn't be hardcoded and instead in an ENV variable
const baseUrl = "http://localhost:8080"

// Ideally this shouldn't be a GET call but rather some sort of socket communication
const trainModel = (filenameOne, filenameTwo) => {
    // url = `${baseUrl}/train/${filenameOne}/${filenameTwo}`
    const request = axios.get(`${baseUrl}/train/${filenameOne}/${filenameTwo}`)
    return request.then(response => response.data);
}

export default {trainModel};
