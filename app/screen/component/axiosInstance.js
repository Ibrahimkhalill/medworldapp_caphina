import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://admin.medworld.online/api',
	timeout: 10000, // 10 seconds timeout (important for Apple!)
});

// Optional: Add a response interceptor for logging or handling token errors
axiosInstance.interceptors.response.use(
	response => response,
	error => {
		// You can do more here like logout on 401, or show alerts
		console.log('API Error:', error?.response || error?.message);
		return Promise.reject(error); // Important to continue throwing error
	}
);

export default axiosInstance;
