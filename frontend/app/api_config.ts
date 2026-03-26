import axios from "axios";

const BASE_URL = "http://localhost:3001";

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

export const postData = async (endpoint: string, data: Record<string, string>) => {
	const response = await api.post(endpoint, data);
	return response.data;
};

export const getData = async (endpoint: string, data?: Record<string, string>) => {
	const response = await api.get(endpoint, { params: data });
	return response.data;
};
