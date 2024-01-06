import { getToken } from 'next-auth/jwt';
import axios from '../axios';

export default async function (req, res) {
	try {
		const tokenData = await getToken({ req });

		const response = await axios.post(
			`/account/purchase-new-travel-plan`,
			req.body,
			{
				headers: { Authorization: 'Bearer ' + tokenData?.token },
			}
		);

		console.log(response);

		res
			.status(!response?.data?.status ? 404 : response?.data?.status)
			.json(response?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
