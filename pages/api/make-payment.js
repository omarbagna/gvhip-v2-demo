import axios from './axios';

export default async function (req, res) {
	const response = await axios.post(`/make-payment`, req.body);

	res.status(response?.data?.status).json(response?.data);
}
