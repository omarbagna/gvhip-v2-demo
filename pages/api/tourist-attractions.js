import axios from './axios';

export default async function (req, res) {
	const response = await axios.get('/tourist-attractions');

	res.status(response?.data?.status).json(response?.data?.data);
}
