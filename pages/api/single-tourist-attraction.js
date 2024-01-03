import axios from './axios';

export default async function (req, res) {
	const { site } = req.body;
	const response = await axios.get(`/tourist-attraction/${site}`);

	res.status(response?.data?.status).json(response?.data?.data);
}
