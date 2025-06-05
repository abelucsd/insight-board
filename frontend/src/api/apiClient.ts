import axios from 'axios';
import { API_URL } from '../utils/data';

const apiClient = axios.create({
  baseURL: API_URL, 
  headers: {
    'Content-type': 'application/json',
  }, 
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject(
        new Error(`Request failed: ${error.response.status} ${error.response.statusText}`)
      );
    } else if (error.request) {
      return Promise.reject(new Error('No response received from server.'));
    } else {
      return Promise.reject(new Error(error.message || 'Unknown error occurred.'));
    }
  }
);

export default apiClient;
