'use client';

import React from 'react';
import DashboardNav from '@/components/Layout/Navigations/DashboardNav';
import { Badge, Skeleton, Stack } from '@mui/material';
import { format } from 'date-fns';
import { HiOutlineLocationMarker, HiOutlineMail } from 'react-icons/hi';
import { BsPhone } from 'react-icons/bs';
//import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import useAxiosAuth from 'hooks/useAxiosAuth';
import { MdOutlinePolicy } from 'react-icons/md';
//import { axiosPrivate } from 'pages/api/axios';

const Dashboard = () => {
	const axiosPrivate = useAxiosAuth();
	//const router = useRouter();

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
							userData?.data?.user_policy_transaction?.end_date
						),
						endDate: addDays(
							new Date(userData?.data?.user_policy_transaction?.end_date),
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
		*/

		staleTime: 500000,
	});

	const USER_DETAILS = userDetails?.data?.data?.data
		? userDetails?.data?.data?.data
		: null;

	return (
		<div className="tw-w-screen tw-min-h-screen tw-bg-[#FEFBFB] tw-py-20 lg:tw-pt-20 lg:tw-pl-56">
			<DashboardNav />
			<div className="tw-w-full tw-h-full tw-py-10 tw-px-6 md:tw-px-12 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-10">
				<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
					<h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold">
						Dashboard
					</h2>

					{/*USER_DETAILS && (
						<div className="tw-w-fit tw-flex tw-justify-start tw-items-center tw-gap-3">
							<Badge
								color={
									USER_DETAILS?.user_policy_transaction?.status === 'verified'
										? 'success'
										: USER_DETAILS?.user_policy_transaction?.status ===
										  'pending'
										? 'warning'
										: 'error'
								}
								className={'tw-animate-pulse'}
								overlap="circular"
								badgeContent=" "
								variant="dot"
							/>
							<p className="tw-capitalize">
								{USER_DETAILS?.user_policy_transaction?.status}
							</p>
						</div>
							)*/}
				</div>

				{!userDetails.isLoading && USER_DETAILS && (
					<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-5 tw-place-content-start tw-place-items-start">
						{USER_DETAILS?.insured_person?.map((person, index) => (
							<div
								key={index}
								className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm xl:tw-col-span-2 tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
									<h3 className="tw-font-medium tw-text-xl tw-text-[#8e6abf]">
										Traveller {index + 1}
									</h3>
									<div className="tw-w-fit tw-flex tw-justify-start tw-items-center tw-gap-3">
										<Badge
											color={
												person?.trip_status === 'verified'
													? 'success'
													: person?.trip_status === 'pending'
													? 'warning'
													: 'error'
											}
											className={'tw-animate-pulse'}
											overlap="circular"
											badgeContent=" "
											variant="dot"
										/>
										<p className="tw-capitalize tw-text-sm">
											{person?.trip_status}
										</p>
									</div>
								</div>
								<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-gap-8">
									<div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-3">
										<h4 className="tw-font-medium tw-text-lg">
											{person?.first_name} {person?.last_name}
										</h4>

										<span className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-place-content-start tw-place-items-start tw-gap-3">
											<span className="tw-flex tw-justify-start tw-items-center tw-gap-2">
												<HiOutlineLocationMarker className="tw-text-xl tw-shrink-0 tw-text-gray-500" />
												<p className="tw-text-sm">{person?.country}</p>
											</span>
											<span className="tw-flex tw-justify-start tw-items-center tw-gap-2">
												<MdOutlinePolicy className="tw-text-xl tw-shrink-0 tw-text-gray-500" />
												<p className="tw-text-sm tw-uppercase">
													{person?.policy_number}
												</p>
											</span>
										</span>
										<span className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-place-content-start tw-place-items-start tw-gap-3">
											<span className="tw-flex tw-justify-start tw-items-center tw-gap-2">
												<HiOutlineMail className="tw-text-xl tw-shrink-0 tw-text-gray-500" />
												<p className="tw-text-sm tw-lowercase">
													{person?.email}
												</p>
											</span>
											<span className="tw-flex tw-justify-start tw-items-center tw-gap-2">
												<BsPhone className="tw-text-xl tw-shrink-0 tw-text-gray-500" />
												<p className="tw-text-sm">{person?.telephone}</p>
											</span>
										</span>
									</div>
								</div>
							</div>
						))}

						<div className="tw-w-full tw-h-fit md:tw-row-start-1 md:tw-col-start-2 md:tw-row-span-2 lg:tw-row-span-1 xl:tw-col-start-3 xl:tw-row-start-1 xl:tw-row-span-2 tw-bg-white tw-text-[#8e6abf] tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
								<h3 className="tw-font-medium tw-text-xl tw-text-[#8e6abf]">
									{
										USER_DETAILS?.user_policy_transaction?.trip_policy
											?.plan_name
									}
								</h3>
							</div>
							<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2 tw-py-3 tw-border-y">
								<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
									Traveller details
								</h2>
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
										Country of Origin
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{USER_DETAILS?.country}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
										Effective Date
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{format(
											new Date(
												USER_DETAILS?.user_policy_transaction?.start_date
											),
											'MMM dd, yyyy'
										)}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
										Expiry Date
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{format(
											new Date(USER_DETAILS?.user_policy_transaction?.end_date),
											'MMM dd, yyyy'
										)}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
										Duration
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{USER_DETAILS?.user_policy_transaction?.duration} days
									</p>
								</div>

								{USER_DETAILS?.user_policy_transaction?.extension_start_date ? (
									<div className="tw-grid tw-grid-cols-2">
										<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
											Extension Starts
										</div>
										<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
											{format(
												new Date(
													USER_DETAILS?.user_policy_transaction?.extension_start_date
												),
												'MMM dd, yyyy'
											)}
										</p>
									</div>
								) : null}

								{USER_DETAILS?.user_policy_transaction?.extension_end_date ? (
									<div className="tw-grid tw-grid-cols-2">
										<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
											Extension Ends
										</div>
										<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
											{format(
												new Date(
													USER_DETAILS?.user_policy_transaction?.extension_end_date
												),
												'MMM dd, yyyy'
											)}
										</p>
									</div>
								) : null}
								{USER_DETAILS?.user_policy_transaction?.extension_duration ? (
									<div className="tw-grid tw-grid-cols-2">
										<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
											Extension Duration
										</div>
										<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
											{
												USER_DETAILS?.user_policy_transaction
													?.extension_duration
											}{' '}
											days
										</p>
									</div>
								) : null}
							</div>
							<div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
										No of Travellers
									</div>
									<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
										{USER_DETAILS?.insured_person?.length}
									</p>
								</div>
								<div className="tw-grid tw-grid-cols-2">
									<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
										Price
									</div>
									<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-xl tw-text-[#8e6abf] tw-font-bold">
										{Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: 'USD',
										}).format(
											USER_DETAILS?.user_policy_transaction?.price *
												USER_DETAILS?.insured_person?.length
										)}{' '}
									</span>
								</div>
							</div>
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

				{!userDetails.isLoading && !USER_DETAILS && (
					<h2>Failed to load data. Please reload this page to try again</h2>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
