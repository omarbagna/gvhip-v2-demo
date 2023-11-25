'use client';

import React, { useState } from 'react';
import DashboardNav from '@/components/Layout/Navigations/DashboardNav';
import { Badge, IconButton, Skeleton, Stack, Tooltip } from '@mui/material';
//import { format, parseISO } from 'date-fns';
//import { HiOutlineLocationMarker, HiOutlineMail } from 'react-icons/hi';
//import { BsPhone, BsQrCode } from 'react-icons/bs';
//import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import useAxiosAuth from 'hooks/useAxiosAuth';
//import { MdOutlinePolicy } from 'react-icons/md';
import dayjs from 'dayjs';
import { TbEye } from 'react-icons/tb';
import { IoClose } from 'react-icons/io5';
import { differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';
import BlurImage from '@/components/BlurImage/BlurImage';

const Dashboard = () => {
	const axiosPrivate = useAxiosAuth();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [histories, setHistories] = useState(null);
	const [showExtensionHistory, setShowExtensionHistory] = useState(false);

	const paymentQuery = router.query;

	const getUserDetails = async () => {
		const response = await axiosPrivate.get('/account/dashboard');

		return response;
	};

	const userDetails = useQuery('user', getUserDetails, {
		/*
		onSuccess: (userData) => {
			if (userData?.status === 200) {
				setDateState([
					{
						startDate: new Date(
							userData?.data?.travelling_info?.user_policy_transaction[0]?.end_date
						),
						endDate: addDays(
							new Date(userData?.data?.travelling_info?.user_policy_transaction[0]?.end_date),
							30
						),
						key: 'selection',
					},
				]);
			}
		},

		onError: (error) => {
			toast.error(`${error?.response?.data?.STATUSMSG}`);
			//logout();
		},
		staleTime: 500000,
		*/
	});

	const USER_DETAILS = userDetails?.data?.data?.data
		? userDetails?.data?.data?.data
		: null;

	const extendUserPolicyRequest = async () => {
		toast.loading('Verifying Policy Extension', {
			toastId: 'verifyExtension',
		});

		const { data: response } = await axiosPrivate.put(
			`/account/extend-policy/${paymentQuery?.uid}?checkoutid=${paymentQuery?.checkoutid}`
		);

		return response;
	};

	const extendUserPolicy = useQuery(
		'extend-user-policy',
		extendUserPolicyRequest,
		{
			onSuccess: (data) => {
				console.log(data);
				if (data?.status === 200) {
					queryClient.invalidateQueries({ queryKey: ['user'] });

					router.replace('/policy-holder', undefined, { shallow: true });

					toast.update('verifyExtension', {
						render: data?.message,
						type: 'success',
						isLoading: false,
						autoClose: 3500,
					});
				} else {
					toast.update('verifyExtension', {
						render: 'Verification failed. Please refresh this page',
						type: 'error',
						isLoading: false,
						autoClose: 3500,
					});
				}
			},

			onError: (error) => {
				console.log(error?.response?.data?.message);
				toast.update('verifyExtension', {
					render: error?.response?.data?.message,
					type: 'error',
					isLoading: false,
					autoClose: 3500,
				});
			},
			enabled: paymentQuery?.uid ? true : false,
		}
	);

	return (
		<div className="tw-max-w-screen tw-min-h-screen tw-bg-[#FEFBFB] tw-py-20 lg:tw-pt-20 lg:tw-pl-56">
			<DashboardNav />
			<div className="tw-w-full tw-h-full tw-py-10 tw-px-6 md:tw-px-12 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-10">
				<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
					<h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold">
						Dashboard
					</h2>

					{USER_DETAILS?.dependants.length === 0 && (
						<div className="tw-w-fit tw-flex tw-justify-start tw-items-center tw-gap-3">
							<Badge
								color={
									USER_DETAILS?.travelling_info?.user_policy_transaction[0]
										?.status === 'verified'
										? 'success'
										: USER_DETAILS?.travelling_info?.user_policy_transaction[0]
												?.status === 'pending'
										? 'warning'
										: 'error'
								}
								className={'tw-animate-pulse'}
								overlap="circular"
								badgeContent=" "
								variant="dot"
							/>
							<p className="tw-capitalize">
								{
									USER_DETAILS?.travelling_info?.user_policy_transaction[0]
										?.status
								}
							</p>
						</div>
					)}
				</div>

				{!userDetails.isLoading && USER_DETAILS && (
					<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-5 tw-place-content-start tw-place-items-start">
						<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm xl:tw-col-span-2 tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
								<h3 className="tw-font-semibold tw-text-lg md:tw-text-xl tw-text-[#8e6abf]">
									Primary
								</h3>
							</div>
							<div className="tw-w-full tw-flex tw-justify-start tw-gap-4 tw-border-y tw-py-3 tw-items-start">
								{/*<BsQrCode className="tw-text-5xl md:tw-text-7xl tw-shrink-0" />*/}
								<BlurImage
									src={USER_DETAILS?.travelling_info?.policy_qr_code}
									alt="qr code"
									height={150}
									width={150}
								/>
								<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
									<h3 className="tw-font-semibold tw-text-lg md:tw-text-xl tw-text-[#8e6abf]">
										{USER_DETAILS?.travelling_info?.first_name}{' '}
										{USER_DETAILS?.travelling_info?.last_name}
									</h3>
									<div className="tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start lg:tw-flex-col lg:tw-items-end tw-gap-3">
										<div className="tw-w-fit tw-shrink-0 tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
											Passport number:
										</div>
										<p className="tw-uppercase tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600 tw-font-bold">
											{USER_DETAILS?.travelling_info?.passport_number}
										</p>
									</div>
									<div className="tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start lg:tw-flex-col lg:tw-items-end tw-gap-3">
										<div className="tw-w-fit tw-shrink-0 tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
											Policy number:
										</div>
										<p className="tw-uppercase tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600 tw-font-bold">
											{USER_DETAILS?.travelling_info?.policy_number}
										</p>
									</div>
									<div className="tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start lg:tw-flex-col lg:tw-items-end tw-gap-3">
										<div className="tw-w-fit tw-shrink-0 tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
											Policy Status:
										</div>
										<p
											className={`tw-capitalize tw-w-full tw-flex tw-justify-start tw-text-sm ${
												USER_DETAILS?.travelling_info
													?.user_policy_transaction[0]?.status === 'verified'
													? 'tw-text-green-600'
													: USER_DETAILS?.travelling_info
															?.user_policy_transaction[0]?.status === 'pending'
													? 'tw-text-yellow-600'
													: 'tw-text-red-600'
											} tw-font-bold`}>
											{
												USER_DETAILS?.travelling_info
													?.user_policy_transaction[0]?.status
											}
										</p>
									</div>
								</div>
							</div>
							<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2">
								<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
									Bio Data
								</h2>
								<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
										First name
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{USER_DETAILS?.travelling_info?.first_name}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
										Last name
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{USER_DETAILS?.travelling_info?.last_name}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
										Date of Birth
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{dayjs(USER_DETAILS?.travelling_info?.dob).format(
											'MMM DD, YYYY'
										)}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
										Gender
									</div>
									<p className="tw-w-full tw-capitalize tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{USER_DETAILS?.travelling_info?.gender}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
										Passport Number
									</div>
									<p className="tw-uppercase tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{USER_DETAILS?.travelling_info?.passport_number}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
										Telephone Number
									</div>
									<p className="tw-uppercase tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										+{USER_DETAILS?.travelling_info?.telephone}
									</p>
								</div>
								{USER_DETAILS?.travelling_info?.user_policy_transaction[0]
									?.extension_start_date ? (
									<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
										<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
											Extension status
										</div>
										<p className="tw-capitalize tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-green-500 tw-font-bold">
											Extended
										</p>
									</div>
								) : null}
								<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
										Expires in
									</div>
									<p
										className={`tw-capitalize tw-w-full tw-flex tw-justify-end tw-text-base ${
											Number(
												differenceInDays(
													new Date(
														USER_DETAILS?.travelling_info
															?.user_policy_transaction[0]?.extension_end_date
															? USER_DETAILS?.travelling_info
																	?.user_policy_transaction[0]
																	?.extension_end_date
															: USER_DETAILS?.travelling_info
																	?.user_policy_transaction[0]?.end_date
													),
													new Date()
												)
											) +
												2 >
											5
												? 'tw-text-green-500'
												: 'tw-text-red-500'
										}  tw-font-bold`}>
										{differenceInDays(
											new Date(
												USER_DETAILS?.travelling_info
													?.user_policy_transaction[0]?.extension_end_date
													? USER_DETAILS?.travelling_info
															?.user_policy_transaction[0]?.extension_end_date
													: USER_DETAILS?.travelling_info
															?.user_policy_transaction[0]?.end_date
											),
											new Date()
										) + 1}{' '}
										days
									</p>
								</div>
							</div>
							{USER_DETAILS?.travelling_info?.user_policy_transaction[0]
								?.status === 'declined' && (
								<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2 tw-py-3 tw-border-t">
									<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
										Policy Status
									</h2>
									<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
										<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
											Status
										</div>
										<p
											className={`tw-w-full tw-capitalize tw-flex tw-justify-end tw-text-sm ${
												USER_DETAILS?.travelling_info
													?.user_policy_transaction[0]?.status === 'verified'
													? 'tw-text-green-600'
													: USER_DETAILS?.travelling_info
															?.user_policy_transaction[0]?.status === 'pending'
													? 'tw-text-yellow-600'
													: 'tw-text-red-600'
											} tw-font-bold`}>
											{
												USER_DETAILS?.travelling_info
													?.user_policy_transaction[0]?.status
											}
										</p>
									</div>
									<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
										<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
											Reason
										</div>
										<p className="tw-w-full tw-capitalize tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
											{
												USER_DETAILS?.travelling_info
													?.user_policy_transaction[0]?.reason
											}
										</p>
									</div>
								</div>
							)}
						</div>

						{USER_DETAILS?.dependants?.map((person, index) => {
							{
								return (
									<div
										key={index}
										className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm xl:tw-col-span-2 tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
										<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
											<h3 className="tw-font-semibold tw-text-lg md:tw-text-xl tw-text-[#8e6abf]">
												Dependant ({person?.relationship_type})
											</h3>
										</div>
										<div className="tw-w-full tw-flex tw-justify-start tw-gap-4 tw-items-start tw-py-4 tw-border-y-2">
											{/*<BsQrCode className="tw-text-5xl md:tw-text-7xl tw-shrink-0" />*/}
											<BlurImage
												src={person?.policy_qr_code}
												alt="qr code"
												height={150}
												width={150}
											/>
											<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
												<h4 className="tw-font-semibold tw-text-lg tw-text-[#8e6abf]">
													{person?.first_name} {person?.last_name}
												</h4>
												<div className="tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start lg:tw-flex-col lg:tw-items-end tw-gap-3">
													<div className="tw-w-fit tw-shrink-0 tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Passport number:
													</div>
													<p className="tw-uppercase tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600 tw-font-bold">
														{person?.passport_number}
													</p>
												</div>
												<div className="tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start lg:tw-flex-col lg:tw-items-end tw-gap-3">
													<div className="tw-w-fit tw-shrink-0 tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Policy number:
													</div>
													<p className="tw-uppercase tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600 tw-font-bold">
														{person?.policy_number}
													</p>
												</div>
												<div className="tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start lg:tw-flex-col lg:tw-items-end tw-gap-3">
													<div className="tw-w-fit tw-shrink-0 tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Policy Status:
													</div>
													<p
														className={`tw-capitalize tw-w-full tw-flex tw-justify-start tw-text-sm ${
															person?.trip_status === 'verified'
																? 'tw-text-green-600'
																: person?.trip_status === 'pending'
																? 'tw-text-yellow-600'
																: 'tw-text-red-600'
														} tw-font-bold`}>
														{person?.trip_status}
													</p>
												</div>
											</div>
										</div>
										<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-gap-8">
											<div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-3">
												<h4 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
													Bio Data
												</h4>
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														First name
													</div>
													<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{person?.first_name}
													</p>
												</div>
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Last name
													</div>
													<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{person?.last_name}
													</p>
												</div>
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
														Passport Number
													</div>
													<p className="tw-uppercase tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{person?.passport_number}
													</p>
												</div>
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
														Policy Number
													</div>
													<p className="tw-uppercase tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{person?.policy_number}
													</p>
												</div>
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Date of Birth
													</div>
													<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{dayjs(person?.dob).format('MMM DD, YYYY')}
													</p>
												</div>
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Gender
													</div>
													<p className="tw-w-full tw-capitalize tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{person?.gender}
													</p>
												</div>
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
														Telephone Number
													</div>
													<p className="tw-uppercase tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														+{person?.telephone}
													</p>
												</div>
												{person?.user_policy_transaction[0]
													?.extension_start_date ? (
													<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
														<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
															Extension status
														</div>
														<p className="tw-capitalize tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-green-500 tw-font-bold">
															Extended
														</p>
													</div>
												) : null}
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
														Expires in
													</div>
													<p
														className={`tw-capitalize tw-w-full tw-flex tw-justify-end tw-text-base ${
															Number(
																differenceInDays(
																	new Date(
																		person?.user_policy_transaction[0]
																			?.extension_end_date
																			? person?.user_policy_transaction[0]
																					?.extension_end_date
																			: person?.user_policy_transaction[0]
																					?.end_date
																	),
																	new Date()
																)
															) +
																2 >
															5
																? 'tw-text-green-500'
																: 'tw-text-red-500'
														}  tw-font-bold`}>
														{differenceInDays(
															new Date(
																person?.user_policy_transaction[0]
																	?.extension_end_date
																	? person?.user_policy_transaction[0]
																			?.extension_end_date
																	: person?.user_policy_transaction[0]?.end_date
															),
															new Date()
														) + 1}{' '}
														days
													</p>
												</div>
											</div>
										</div>
									</div>
								);
							}
						})}

						<div className="tw-w-full tw-h-fit md:tw-row-start-1 md:tw-col-start-2 md:tw-row-span-2 lg:tw-row-span-1 xl:tw-col-start-3 xl:tw-row-start-1 xl:tw-row-span-2 tw-bg-white tw-text-[#8e6abf] tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
								<h3 className="tw-font-medium tw-text-xl tw-text-[#8e6abf]">
									{
										USER_DETAILS?.travelling_info?.user_policy_transaction[0]
											?.travel_plan?.plan_name
									}
								</h3>
							</div>
							<div className="tw-w-full tw-flex tw-flex-col gap-2 tw-py-3 tw-border-y">
								<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
									{USER_DETAILS?.travelling_info?.user_policy_transaction[0]
										?.extension_histories?.length > 0
										? 'Initial details'
										: 'Travel details'}
								</h2>
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
										Country of Origin
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{USER_DETAILS?.travelling_info?.country}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
										Effective Date
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{dayjs(
											USER_DETAILS?.travelling_info?.user_policy_transaction[0]
												?.start_date
										).format('MMM DD, YYYY')}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
										Expiry Date
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{dayjs(
											USER_DETAILS?.travelling_info?.user_policy_transaction[0]
												?.end_date
										).format('MMM DD, YYYY')}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
										Duration
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{
											USER_DETAILS?.travelling_info?.user_policy_transaction[0]
												?.duration
										}{' '}
										days
									</p>
								</div>
								{USER_DETAILS?.dependants?.length > 0 && (
									<div className="tw-grid tw-grid-cols-2">
										<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
											No of Travellers
										</div>
										<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
											{USER_DETAILS?.dependants?.length + 1}
										</p>
									</div>
								)}
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
										Price
									</div>
									<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-lg tw-text-[#8e6abf] tw-font-bold">
										{Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: 'USD',
										}).format(
											USER_DETAILS?.travelling_info?.user_policy_transaction[0]
												?.price
										)}
										<em className="tw-font-light tw-text-xs">/person</em>
									</span>
								</div>
							</div>
							<div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-py-1">
								{USER_DETAILS?.travelling_info?.user_policy_transaction[0]
									?.extension_histories?.length > 0 ? (
									<div className="tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-center tw-gap-2">
										<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
											Extensions
										</div>

										<div className="tw-w-full tw-flex tw-justify-start tw-items-center">
											<Tooltip
												placement="left-end"
												title={`View ${USER_DETAILS?.travelling_info?.first_name}'s extension history`}>
												<p
													onClick={() => {
														setHistories({
															name: `${USER_DETAILS?.travelling_info?.first_name} ${USER_DETAILS?.travelling_info?.last_name}`,
															extensions:
																USER_DETAILS?.travelling_info
																	?.user_policy_transaction[0]
																	?.extension_histories,
														});
														setShowExtensionHistory(true);
													}}
													className="tw-transition-all tw-duration-300 tw-ease-in-out tw-w-fit tw-cursor-pointer tw-flex tw-justify-center tw-rounded-full tw-border-2 tw-pl-3 tw-pr-1 tw-border-transparent hover:tw-border-[#8e6abf] tw-text-sm tw-items-center tw-gap-0 tw-text-gray-600 hover:tw-text-[#8e6abf] tw-font-bold">
													{USER_DETAILS?.travelling_info?.first_name}{' '}
													{USER_DETAILS?.travelling_info?.last_name}{' '}
													<span className="tw-cursor-pointer  tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-8 tw-w-8 tw-text-[#8e6abf]">
														<TbEye className="tw-text-xl" />
													</span>
												</p>
											</Tooltip>
										</div>
									</div>
								) : null}

								{USER_DETAILS?.dependants?.map((person, index) => {
									if (
										person.user_policy_transaction[0]?.extension_histories
											?.length > 0
									) {
										return (
											<div
												key={index}
												className="tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-center tw-gap-2">
												{USER_DETAILS?.travelling_info
													?.user_policy_transaction[0]?.extension_histories
													?.length > 0 ? null : (
													<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
														Extensions
													</div>
												)}

												<div className="tw-w-full tw-flex tw-justify-start tw-items-center">
													<Tooltip
														placement="left-end"
														title={`View ${person.first_name}'s extension history`}>
														<p
															onClick={() => {
																setHistories({
																	name: `${person.first_name} ${person.last_name}`,
																	extensions:
																		person.user_policy_transaction[0]
																			?.extension_histories,
																});
																setShowExtensionHistory(true);
															}}
															className="tw-transition-all tw-duration-300 tw-ease-in-out tw-cursor-pointer tw-flex tw-w-fit tw-justify-center tw-rounded-full tw-border-2 tw-pl-3 tw-pr-1 tw-border-transparent hover:tw-border-[#8e6abf] tw-text-sm tw-items-center tw-gap-0 tw-text-gray-600 hover:tw-text-[#8e6abf] tw-font-bold">
															{person.first_name} {person.last_name}{' '}
															<span className="tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-8 tw-w-8 tw-text-[#8e6abf]">
																<TbEye className="tw-text-xl" />
															</span>
														</p>
													</Tooltip>
												</div>
											</div>
										);
									} else {
										return null;
									}
								})}
							</div>
							{/**
							<div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
										Total Price
									</div>
									{USER_DETAILS?.travelling_info?.user_policy_transaction[0]
										?.extension_price ? (
										<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-xl tw-text-[#8e6abf] tw-font-bold">
											{Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(
												USER_DETAILS?.travelling_info
													?.user_policy_transaction[0]?.price +
													USER_DETAILS?.travelling_info
														?.user_policy_transaction[0]?.extension_price
											)}{' '}
										</span>
									) : (
										<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-xl tw-text-[#8e6abf] tw-font-bold">
											{Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(
												USER_DETAILS?.dependants?.length > 0
													? USER_DETAILS?.travelling_info
															?.user_policy_transaction[0]?.price *
															USER_DETAILS?.dependants?.length
													: USER_DETAILS?.travelling_info
															?.user_policy_transaction[0]?.price
											)}{' '}
										</span>
									)}
								</div>
							</div>
								 */}
						</div>
					</div>
				)}

				{userDetails.isLoading && (
					<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-5 tw-place-content-start tw-place-items-start">
						<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm xl:tw-col-span-2 tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<Stack spacing={1} sx={{ width: '100%' }}>
								<Skeleton
									variant="text"
									sx={{ fontSize: '3rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '2rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '1rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '1rem', width: '100%' }}
								/>
							</Stack>
						</div>
						<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm xl:tw-col-span-2 tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<Stack spacing={1} sx={{ width: '100%' }}>
								<Skeleton
									variant="text"
									sx={{ fontSize: '3rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '2rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '1rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '1rem', width: '100%' }}
								/>
							</Stack>
						</div>
						<div className="tw-w-full tw-h-fit tw-row-start-1 tw-col-start-2 tw-row-span-2 lg:tw-row-span-1 xl:tw-col-start-3 xl:tw-row-start-1 xl:tw-row-span-2 tw-bg-white tw-text-[#8e6abf] tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<Stack spacing={1} sx={{ width: '100%' }}>
								<Skeleton
									variant="text"
									sx={{ fontSize: '2rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '1rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '1rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '1rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '1rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '1rem', width: '100%' }}
								/>
								<Skeleton
									variant="text"
									sx={{ fontSize: '1rem', width: '100%' }}
								/>
							</Stack>
						</div>
					</div>
				)}

				{showExtensionHistory && (
					<div
						onClick={() => {
							setShowExtensionHistory(false);
							setHistories(null);
						}}
						className="tw-fixed tw-top-0 tw-left-0 tw-z-[999] tw-flex tw-justify-center tw-items-center tw-w-screen tw-h-screen tw-bg-black/50">
						<div
							data-aos="zoom-in"
							data-aos-duration="600"
							onClick={(e) => e.stopPropagation()}
							className="tw-font-medium tw-text-center tw-text-lg tw-w-5/6 tw-h-5/6 tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-4 md:tw-px-8 tw-flex tw-flex-col tw-justify-start tw-items-center tw-gap-5 tw-overflow-y-auto">
							<div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pb-3">
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-pb-2 tw-my-5 tw-border-b-2">
									<h2 className="tw-font-medium tw-text-2xl tw-text-[#524380]">
										Extension History {histories && `(${histories?.name})`}
									</h2>
									<IconButton
										aria-label="close modal"
										onClick={() => {
											setShowExtensionHistory(false);
											setHistories(null);
										}}>
										<IoClose className="tw-text-xl tw-text-[#8e6abf]" />
									</IconButton>
								</div>
								{histories && (
									<div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-4">
										{histories?.extensions?.map((extensionData, index) => (
											<div
												key={index}
												className="tw-transition-all tw-duration-300 tw-ease-in-out tw-w-full tw-h-fit tw-bg-white tw-text-[#8e6abf] tw-border-2 tw-shadow-md tw-shadow-[#6c14e8]/10 hover:tw-shadow-lg hover:tw-shadow-[#6c14e8]/30 tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
												<div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pbz-3">
													<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
														Extension details
													</h2>

													<div className="tw-grid tw-grid-cols-2">
														<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
															Extended By
														</div>
														<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
															{extensionData?.extension_status_updated_by}
														</p>
													</div>

													<div className="tw-grid tw-grid-cols-2">
														<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
															Extension Starts
														</div>
														<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
															{dayjs(
																extensionData?.extension_start_date
															).format('MMM DD, YYYY')}
														</p>
													</div>

													<div className="tw-grid tw-grid-cols-2">
														<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
															Extension Ends
														</div>
														<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
															{dayjs(extensionData?.extension_end_date).format(
																'MMM DD, YYYY'
															)}
														</p>
													</div>

													<div className="tw-grid tw-grid-cols-2">
														<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
															Extension Duration
														</div>
														<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
															{extensionData?.extension_duration} days
														</p>
													</div>

													<div className="tw-grid tw-grid-cols-2">
														<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
															Extension Price
														</div>
														<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
															{Intl.NumberFormat('en-US', {
																style: 'currency',
																currency: 'USD',
															}).format(extensionData?.extension_price)}
														</p>
													</div>

													<div className="tw-w-full tw-flex tw-justify-center tw-border-t-2 tw-pt-3 tw-mt-2">
														<span className="tw-w-fit tw-h-fit tw-p-2 tw-flex tw-gap-2 tw-justify-center tw-items-end tw-rounded-md tw-bg-gradient-to-tr tw-from-[#874cda] tw-to-[#8e6abf]">
															<span className="tw-text-xs tw-text-gray-100 tw-font-normal">
																Updated:
															</span>
															<p className="tw-text-xs tw-text-gray-50 tw-font-semibold">
																{dayjs(
																	extensionData?.extension_status_update_date
																).format('MMM DD, YYYY')}{' '}
																at{' '}
																{dayjs(
																	extensionData?.extension_status_update_date
																).format('hh:mm a')}
															</p>
														</span>
													</div>
												</div>
											</div>
										))}
									</div>
								)}

								{!histories && (
									<div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 xl:tw-grid-cols-3">
										<div className="tw-transition-all tw-duration-300 tw-ease-in-out tw-w-full tw-h-fit tw-bg-white tw-text-[#8e6abf] tw-border-2 tw-shadow-md tw-shadow-[#6c14e8]/10 hover:tw-shadow-lg hover:tw-shadow-[#6c14e8]/30 tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
											<Stack spacing={1} sx={{ width: '100%' }}>
												<Skeleton
													variant="text"
													sx={{ fontSize: '2rem', width: '50%' }}
												/>
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '60%' }}
												/>
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '40%' }}
												/>
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '80%' }}
												/>
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '70%' }}
												/>
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '60%' }}
												/>
											</Stack>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				{!userDetails.isLoading && !USER_DETAILS && (
					<h2>Failed to load data. Please reload this page to try again</h2>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
