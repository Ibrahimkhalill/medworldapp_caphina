import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://medworld.duckdns.org/api',
});

export default axiosInstance;
