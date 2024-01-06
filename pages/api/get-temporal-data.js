import axios from './axios';

export default async function (req, res) {
	try {
		const { uid } = req.body;
		const response = await axios.get(`/get-user-data?uid=${uid}`);

		res.status(response?.data?.status).json(response?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
