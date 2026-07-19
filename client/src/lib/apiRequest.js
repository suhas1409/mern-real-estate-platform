import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ATTACH TOKEN
apiRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// HANDLE AUTH ERRORS
apiRequest.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    const message =
      error.response?.data?.message;

    const requestUrl = error.config?.url;

    const isAuthRequest =
      requestUrl?.includes("/auth/login") ||
      requestUrl?.includes("/auth/register");

    // TOKEN EXPIRED OR UNAUTHORIZED
    if (
      !isAuthRequest &&
      localStorage.getItem("token") &&
      (
        status === 401 ||
        status === 403 ||
        message === "Token expired"
      )
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default apiRequest;