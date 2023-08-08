import axios from 'axios'

const instance = axios.create({
    // baseURL: "https://faju-qt60.onrender.com/api"
    baseURL: "http://localhost:5550/api"
})

export default instance
