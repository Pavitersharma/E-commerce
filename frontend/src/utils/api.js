import axios from "axios";

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isLocalhost ? "http://localhost:5000" : "https://fashionhub-api.onrender.com"),
});

export default API;
