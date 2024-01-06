import axios from './axios';

export default async function (req, res) {
	try {
		const response = await axios.post(`/reset-password`, req.body);

		res.status(response?.data?.status).json(response?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
