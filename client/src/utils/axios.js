import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/service',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('refresh_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            // Token expired or invalid
            localStorage.removeItem('refresh_token');
            // Instead of forcing a page reload, just reject the promise
            // The component will handle the navigation
            return Promise.reject({
                ...error,
                message: 'Session expired. Please login again.'
            });
        }
        return Promise.reject(error);
    }
);

export default instance; 