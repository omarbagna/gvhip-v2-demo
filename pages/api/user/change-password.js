import { axiosPrivate } from '../axios';
import { getToken } from 'next-auth/jwt';

export default async function (req, res) {
	try {
		const tokenData = await getToken({ req });
		const { current_password, new_password, confirm_password } = req.body;
		const response = await axiosPrivate.put(
			`/account/change-password`,
			{
				current_password: current_password,
				new_password: new_password,
				confirm_password: confirm_password,
			},
			{
				headers: { Authorization: 'Bearer ' + tokenData?.token },
			}
		);

		res.status(response?.status).json(response?.data);
	} catch (error) {
		res.status(error?.response?.status).json(error?.response?.data);
	}
}
