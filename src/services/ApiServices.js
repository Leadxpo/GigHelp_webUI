import axios from 'axios';
import axiosRetry from 'axios-retry';

const baseURL = 'https://server.gighelp.in/';
// const baseURL = 'http://localhost:3001/';

const ApiService = (() => {
  const axiosInstance = axios.create({
    baseURL,
    timeout: 30000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  // Retry setup
  axiosRetry(axiosInstance, {
    retries: 2,
    retryDelay: retryCount => retryCount * 2000,
    retryCondition: error =>
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === 'ECONNABORTED',
  });

  // ✅ Request Interceptor
  axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const fullUrl = `${config.baseURL}${config.url}`;
      console.log('Triggered API URL:', fullUrl);

      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }

      return config;
    },
    error => Promise.reject(error),
  );

  // ✅ Response Interceptor
  axiosInstance.interceptors.response.use(
    response => response.data,
    error => {
      console.log('===== AXIOS ERROR =====');
      console.log('Message:', error.message);
      console.log('Code:', error.code);
      console.log('Response:', error.response);

      // Replacing React Native Alert with normal alert() for web
      const showAlert = (title, message) => {
        alert(`${title}: ${message}`);
      };

      if (error.code === 'ECONNABORTED') {
        showAlert('Timeout', 'Request took too long. Please try again.');
      } else if (error.response?.status === 500) {
        showAlert('Server Error', 'Something went wrong on the server.');
      } else if (error.response?.status === 404) {
        showAlert('Not Found', 'Requested resource was not found.');
      } else if (error.response?.status === 401) {
        showAlert('Unauthorized', 'You are not authorized.');
      } else if (error.message === 'Network Error') {
        showAlert('Network Error', 'Please check your internet connection.');
      } else {
        showAlert('Error', error.message || 'Something went wrong');
      }

      return Promise.reject(error);
    },
  );

  // Common API methods
  const requestWithOptionalTimeout = (method, url, data, options = {}) => {
    const config = {
      ...options,
      timeout: options.timeout || 30000,
    };
    return axiosInstance[method](url, data, config);
  };

  return {
    get: (url, params, options) => axiosInstance.get(url, {params, ...options}),
    post: (url, data, options) =>
      requestWithOptionalTimeout('post', url, data, options),
    put: (url, data, options) =>
      requestWithOptionalTimeout('put', url, data, options),
    patch: (url, data, options) =>
      requestWithOptionalTimeout('patch', url, data, options),
    delete: (url, options) => axiosInstance.delete(url, {...options}),
    baseURL,
  };
})();

export default ApiService;
