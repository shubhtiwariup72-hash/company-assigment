import axiosInstance from "../services/axiosInstance";

export const getProducts = async () => {
  const res = await axiosInstance.get("/products");
  return res.data.data;
};

export const getProductById = async (id) => {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data.data;
};

export const addProduct = async (data) => {
  const res = await axiosInstance.post("/products", data);
  return res.data.data;
};

export const updateProduct = async ({ id, data }) => {
  const res = await axiosInstance.put(`/products/${id}`, data);
  return res.data.data;
};

export const deleteProduct = async (id) => {
  const res = await axiosInstance.delete(`/products/${id}`);
  return res.data;
};
