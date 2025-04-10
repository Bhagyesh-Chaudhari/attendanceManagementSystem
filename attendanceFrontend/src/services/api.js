import axios from "axios"

// Create an axios instance with a base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/teacher",
})

export default API
