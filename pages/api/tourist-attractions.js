import axios from './axios';

export default async function (req, res) {
	try {
		const response = await axios.get('/tourist-attractions');

		res.status(response?.data?.status).json(response?.data?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
