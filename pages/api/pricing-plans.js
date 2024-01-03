import axios from './axios';

export default async function (req, res) {
	const response = await axios.get(`/pricing-plans`);

	res.status(200).json(response?.data?.data);
}
