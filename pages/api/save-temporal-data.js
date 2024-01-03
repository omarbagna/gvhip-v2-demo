import axios from './axios';

export default async function (req, res) {
	const response = await axios.post(`/temporary-user-data`, req.body);
	console.log(response);
	res.status(response?.data?.status).json(response?.data);
}
