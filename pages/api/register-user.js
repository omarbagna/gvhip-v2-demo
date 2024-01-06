import axios from './axios';

export default async function (req, res) {
	try {
		const { uid, checkoutid } = req.body;
		const response = await axios.post(
			`/register/${uid}?checkoutid=${checkoutid}`
		);

		res.status(response?.status).json(response?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
