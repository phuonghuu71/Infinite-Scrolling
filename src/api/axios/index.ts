import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com/products",
});

export const apiHandler = async (options = {}) => {
  const res = await api.get("/search", options);

  return res.data;
};
