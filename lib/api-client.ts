import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3009',
	withCredentials: true,
});

apiClient.interceptors.response.use(
	res => res,
	async error => {
		const originalRequest = error.config;
		console.log('🚀 ~ AxiosError::', error);
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				await axios.post(
					`${process.env.NEXT_PUBLIC_API_URL}/api-gateway/refresh-token`,
					{},
					{ withCredentials: true }
				);
				return apiClient(originalRequest);
			} catch (err) {
				window.location.href = '/auth';
				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
