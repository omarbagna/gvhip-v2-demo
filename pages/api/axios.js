import axios from 'axios';
const BASE_URL = 'https://gvhip-v2-demo-api.rxhealthbeta.com/api/v2';
//const BASE_URL = 'https://gvhip-v2-backend-api.rxhealthbeta.com/api/v2';

export default axios.create({
	baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		//'Content-Type': 'multipart/form-data',
		'Access-Control-Allow-Origin': '*',
	},
});
