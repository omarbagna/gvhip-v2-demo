import axios from './axios';

export default async function (req, res) {
	const { uid, checkoutid } = req.body;
	const response = await axios.post(
		`/register/${uid}?checkoutid=${checkoutid}`
	);

	res.status(response?.data?.status).json(response?.data);
}
