import { getToken } from 'next-auth/jwt';
import axios from '../axios';

export default async function (req, res) {
	try {
		const tokenData = await getToken({ req });

		const { uid, checkoutid } = req.body;
		const response = await axios.put(
			`/account/complete-new-purchase-plan/${uid}?checkoutid=${checkoutid}`,
			{ checkoutid: checkoutid },
			{
				headers: { Authorization: 'Bearer ' + tokenData?.token },
			}
		);

		res.status(response?.data?.status).json(response?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
