import { axiosPrivate } from '../axios';
import { getToken } from 'next-auth/jwt';

export default async function (req, res) {
	try {
		const tokenData = await getToken({ req });

		const { filter } = req.body;

		const response = await axiosPrivate.get(
			`/admin/statistics?filter=${filter}`,
			{
				headers: { Authorization: 'Bearer ' + tokenData?.token },
			}
		);

		res.status(response?.data?.status).json(response?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
