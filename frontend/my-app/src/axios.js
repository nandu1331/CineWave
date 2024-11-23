
//const API_KEY = "7c8de2a388acb53e053f789245bde1e9";

// const response = {
//   method: 'GET',
//   url: `https://api.themoviedb.org/3/`, // Ensure this is correct
//   params: {
//       api_key: API_KEY, // Replace with your actual TMDB API key
//       language: 'en-US',
//       region: 'US',
//   },
// };

// export default response

// frontend/src/axios.js
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;

// Create two axios instances
export const tmdbAxios = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    params: {
        api_key: API_KEY,
        language: 'en-US',
    }
});

export const djangoAxios = axios.create({
  baseURL: 'http://localhost:8000/api/',
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