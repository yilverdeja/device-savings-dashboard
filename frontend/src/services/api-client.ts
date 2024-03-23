import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:5000',
});

class APIClient<T> {
	endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = endpoint;
	}

	getAll = (config: AxiosRequestConfig) => {
		return axiosInstance
			.get<T[]>(this.endpoint, config)
			.then((res) => res.data);
	};

	get = (slug: number | string, config: AxiosRequestConfig) => {
		return axiosInstance
			.get<T>(this.endpoint + '/' + slug, config)
			.then((res) => res.data);
	};
}

export default APIClient;
