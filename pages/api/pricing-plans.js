import axios from './axios';

export default async function (req, res) {
	try {
		const response = await axios.get(`/pricing-plans`);

		res.status(200).json(response?.data?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
