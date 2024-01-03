import { axiosPrivate } from '../axios';
import { getToken } from 'next-auth/jwt';

export default async function (req, res) {
	try {
		const tokenData = await getToken({ req });
		const response = await axiosPrivate.get(`/account/extension-history`, {
			headers: { Authorization: 'Bearer ' + tokenData?.token },
		});

		res.status(response?.data?.status).json(response?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
