import axiosInstance from "../services/axiosInstance";

export const getStats = async () => {
  const res = await axiosInstance.get("/stats");
  return res.data.data;
};
