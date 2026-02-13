//0)  This interceptor assumes that a 401 on a non-auth route means the access token expired, so it refreshes the token and retries the failed request.
// 1) api.interceptors.response.use();
// 👉 Register a response interceptor on the Axios instance.
// This runs after every HTTP response (success or error).

//2)  (response) => response,
//    👉 Success handler
//   If the request succeeds (2xx)
//   Do nothing
//   Just pass the response through

//3)     async (error) => {
//    👉 Error handler
//    Runs when a request fails (4xx, 5xx, network errors)
//    This is where token refresh logic lives

//4)        const originalRequest = error.config as { _retry?:        boolean; url?: string };
//     👉 Extract the request config that failed
//     error.config = Axios request blueprint
//    _retry is a custom flag you add to prevent infinite loops
//      url is used to check excluded routes

// 5)         const requestUrl = originalRequest.url ?? "";
//        👉 Safely get the request URL
//         Avoids crashes if url is undefined

//6)             if (AUTH_EXCLUDE_ROUTES.some((route) => requestUrl.includes(route))) {
//   return Promise.reject(error);
// }
//    Exit early if the request was an auth endpoint
//    Prevents infinite loops
//     Prevents pointless refresh attempts
//     Lets login/signup errors behave normally

//7)         if (error.response?.status === 401 && !originalRequest._retry) {
//
//       Only handle:
//       401 Unauthorized
//       requests that haven’t already been retried

//8)           originalRequest._retry = true;
//         👉 Mark this request as already retried
//          prevents:
//          401 → refresh → retry → 401 → refresh → loop
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 🔑 required for cookies
});

let isRefreshing = false;
let queue: Array<(value?: unknown) => void> = [];

const AUTH_EXCLUDE_ROUTES = [
  "/auth/login", // If a request to any of these endpoints returns 401, no refresh attempt is made.
  "/auth/signup",

  "/auth/refresh-token",
];
//interceptor=checkpoint
//config is the blueprint of the request that just failed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as { _retry?: boolean; url?: string };

    const requestUrl = originalRequest.url ?? "";

    // Skip refresh logic for auth routes
    if (AUTH_EXCLUDE_ROUTES.some((route) => requestUrl.includes(route))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        await api.post("/auth/refresh-token");
        queue.forEach((cb) => cb());
        queue = [];
        return api(originalRequest);
      } catch {
        queue = [];
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
