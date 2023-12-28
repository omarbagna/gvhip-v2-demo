import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default axios.create({
	baseURL: BASE_URL,
	headers: {
		'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
	},
});

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
		'Access-Control-Allow-Origin': '*',
	},
});
