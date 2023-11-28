import axios from "axios";
import Router from "next/router";
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message === "Token expired.") {
      if (typeof window !== "undefined") {
        Router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
