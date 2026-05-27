import axiosInstance from "../services/axiosInstance";

export const loginUser = async (credentials) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data;
};
