import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000/teacher", // adjust if your port is different
})

export default API
