import { axiosPrivate } from '../axios';
import { getToken } from 'next-auth/jwt';

export default async function (req, res) {
	try {
		const tokenData = await getToken({ req });

		const { search_type, search_term } = req.body;

		const response = await axiosPrivate.get(
			`/admin/search-user?search_type=${search_type}&search_term=${search_term}`,
			{
				headers: { Authorization: 'Bearer ' + tokenData?.token },
			}
		);

		res.status(response?.status).json(response?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
