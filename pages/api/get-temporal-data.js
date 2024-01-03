import axios from './axios';

export default async function (req, res) {
	const { uid } = req.body;
	const response = await axios.get(`/get-user-data?uid=${uid}`);

	res.status(response?.data?.status).json(response?.data);
}
