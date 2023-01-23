import axios from "axios"

export const api = axios.create({
  baseURL: "http://192.168.198.148:3333",
})
