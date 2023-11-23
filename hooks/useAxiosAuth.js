'use client';

import { useSession } from 'next-auth/react';
import { axiosPrivate } from 'pages/api/axios';
import { useEffect } from 'react';
//import useRefreshToken from './useRefreshToken';

const useAxiosAuth = () => {
	const { data: session } = useSession();
	//const refreshToken = useRefreshToken();

	// Add the Bearer Token to each API request
	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers.Authorization) {
					config.headers.Authorization = `Bearer ${session?.user?.token}`;
				}

				return config;
			},
			(error) => Promise.reject(error)
		);

		/*
//Refresh Token Interceptor

		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error.config;

				if (error.response.status === 401 && !prevRequest.sent) {
					prevRequest.sent = true;

					await refreshToken();

					prevRequest.headers.Authorization = `Bearer ${session?.user.token}`;

					return axiosPrivate(prevRequest);
				}

				return Promise.reject(error);
			}
		);
		*/

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
			//axiosPrivate.interceptors.response.eject(responseIntercept);
		};
	}, [
		session,
		//, refreshToken
	]);

	return axiosPrivate;
};

export default useAxiosAuth;
