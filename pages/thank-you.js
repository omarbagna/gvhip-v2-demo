import React from 'react';
import Link from 'next/link';
// import baseUrl from '@/utils/baseUrl';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Backdrop, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';

import logo from '@/public/images/gsti_logo.jpeg';
import BlurImage from '@/components/BlurImage/BlurImage';
import { MdErrorOutline, MdVerified } from 'react-icons/md';
import { toast } from 'react-toastify';

const ThankYou = () => {
	const router = useRouter();

	const paymentQuery = router.query;

	const registerUserRequest = async () => {
		toast.loading('Confirming payment', {
			toastId: 'confirmingPayment',
		});
		const url = `/api/register-user`;
		const payload = {
			uid: paymentQuery?.uid,
			checkoutid: paymentQuery?.checkoutid,
		};

		const response = await axios.post(url, payload);

		return response;
	};

	const registerUser = useQuery('register-user', registerUserRequest, {
		onSuccess: (data) => {
			if (data?.data?.status === 200) {
				toast.update('confirmingPayment', {
					render: data?.data?.message,
					type: 'success',
					isLoading: false,
					autoClose: 3500,
				});
				router.replace('/thank-you', undefined, { shallow: true });
			} else {
				toast.update('confirmingPayment', {
					render: data?.data?.message,
					type: 'error',
					isLoading: false,
					autoClose: 3500,
				});
			}
		},

		onError: (error) => {
			toast.update('confirmingPayment', {
				render: error?.response?.data?.message,
				type: 'error',
				isLoading: false,
				autoClose: 3500,
			});
		},
		enabled: paymentQuery?.uid ? true : false,
	});

	const CONFIRMATION_DATA = registerUser?.data?.data?.data
		? registerUser?.data?.data?.data
		: null;

	return (
		<div className="thank-you-area">
			<div className="d-table">
				<div className="d-table-cell">
					<div className="container">
						{CONFIRMATION_DATA ? (
							<div className="thank-you-content">
								<Link href="/">
									<a className="tw-p-1 tw-flex tw-justify-center tw-items-center tw-gap-2">
										<BlurImage
											height={90}
											width={100}
											src={logo}
											alt="site logo"
											className="rounded-2"
										/>
									</a>
								</Link>
								<span className="tw-w-full tw-flex tw-items-center tw-justify-center tw-gap-5 tw-my-5">
									<MdVerified className="tw-text-4xl tw-text-green-600" />
									<h3 className="!tw-w-fit !tw-text-left !tw-my-0 tw-text-green-600">
										Purchase Verified
									</h3>
								</span>

								<p>
									Policy created, please check your inbox for your login
									credentials.
								</p>

								<Link href="/authentication">
									<a className="btn-style-one red-light-color">
										Click here to login <i className="bx bx-chevron-right"></i>
									</a>
								</Link>
							</div>
						) : (
							CONFIRMATION_DATA === null &&
							!registerUser.isLoading && (
								<div className="thank-you-content">
									<Link href="/">
										<a className="tw-p-1 tw-flex tw-justify-center tw-items-center tw-gap-2">
											<BlurImage
												height={90}
												width={100}
												src={logo}
												alt="site logo"
												className="rounded-2"
											/>
										</a>
									</Link>
									<span className="tw-w-full tw-flex tw-items-center tw-justify-center tw-gap-5 tw-my-5">
										<MdErrorOutline className="tw-text-4xl tw-text-red-600" />

										<h3 className="!tw-w-fit !tw-text-left !tw-my-0 tw-text-red-600">
											Verification Failed
										</h3>
									</span>
									<p>
										Policy purchase verification failed. Please contact our
										helpdesk for further assistance.
									</p>
								</div>
							)
						)}
					</div>
				</div>
			</div>

			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				className="tw-bg-[#7862AF]/80 tw-backdrop-blur-md"
				open={registerUser.isLoading}>
				<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
					<CircularProgress color="inherit" />
					<p className="tw-text-white tw-font-medium tw-text-center tw-text-lg tw-w-2/3">
						Please wait, confirming purchase
					</p>
				</div>
			</Backdrop>
		</div>
	);
};

export default ThankYou;
