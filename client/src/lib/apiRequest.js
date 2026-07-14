import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:8800/api",
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

// HANDLE UNAUTHORIZED REQUESTS
apiRequest.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    const isAuthRequest =
      requestUrl?.includes("/auth/login") ||
      requestUrl?.includes("/auth/register");

    if (
      status === 401 &&
      !isAuthRequest &&
      localStorage.getItem("token")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiRequest;