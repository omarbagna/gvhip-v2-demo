'use client';

import { useSession } from 'next-auth/react';
import axios from 'pages/api/axios';

const useRefreshToken = () => {
	const { data: session } = useSession();

	const refreshToken = async () => {
		const res = await axios.post('/auth/refresh', {
			refresh: session?.user.refreshToken,
		});

		if (session) session.user.token = res.data.token;
	};

	return refreshToken;
};

export default useRefreshToken;
