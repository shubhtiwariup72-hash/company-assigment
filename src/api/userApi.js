import axiosInstance from "../services/axiosInstance";

export const getUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data.data;
};

export const getUserById = async (id) => {
  const res = await axiosInstance.get(`/users/${id}`);
  return res.data.data;
};

export const addUser = async (data) => {
  const res = await axiosInstance.post("/users", data);
  return res.data.data;
};

export const updateUser = async ({ id, data }) => {
  const res = await axiosInstance.put(`/users/${id}`, data);
  return res.data.data;
};

export const deleteUser = async (id) => {
  const res = await axiosInstance.delete(`/users/${id}`);
  return res.data;
};
