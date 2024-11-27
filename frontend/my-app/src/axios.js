import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = process.env.REACT_APP_BASE_URL;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const tmdbAxios = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'en-US',
    }
});

export const djangoAxios = axios.create({
    baseURL: BACKEND_URL || 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});


// Add request interceptor for authentication
djangoAxios.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);
