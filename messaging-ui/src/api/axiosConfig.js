import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/';
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const tokenResult = await axios.post('token/refresh/', { refresh: localStorage.getItem('refresh') });
        localStorage.setItem('access', tokenResult.data.access);
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenResult.data.access}`;
        return axios(originalRequest);
    }
    return Promise.reject(error);
});

export default axios;
