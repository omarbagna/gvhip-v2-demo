import axios from './axios';

export default async function (req, res) {
	try {
		const { site } = req.body;
		const response = await axios.get(`/tourist-attraction/${site}`);

		res.status(response?.data?.status).json(response?.data?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
