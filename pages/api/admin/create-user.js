import { axiosPrivate } from '../axios';
import { getToken } from 'next-auth/jwt';

export default async function (req, res) {
	try {
		const tokenData = await getToken({ req });
		const response = await axiosPrivate.post('admin/users/create', req.body, {
			headers: { Authorization: 'Bearer ' + tokenData?.token },
		});

		res.status(response?.status).json(response?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
