'use client';

import React, { useEffect, useState } from 'react';
import DashboardNav from '@/components/Layout/Navigations/DashboardNav';
import { useMutation, useQuery } from 'react-query';
import { Backdrop, CircularProgress, Skeleton, Stack } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// import baseUrl from '@/utils/baseUrl';
import axios from 'axios';

import LineChart from '@/components/Dashboard/LineChart';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';
const MySwal = withReactContent(Swal);

const alert = (title = null, text = null, icon = null) => {
	MySwal.fire({
		title: title,
		text: text,
		icon: icon,
		timer: 8000,
		timerProgressBar: true,
		showConfirmButton: false,
	});
};

const nFormatter = (num) => {
	const lookup = [
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: 'k' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e9, symbol: 'G' },
		{ value: 1e12, symbol: 'T' },
		{ value: 1e15, symbol: 'P' },
		{ value: 1e18, symbol: 'E' },
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var item = lookup
		.slice()
		.reverse()
		.find(function (item) {
			return num >= item.value;
		});
	return item
		? (num / item.value).toFixed(1).replace(rx, '$1') + item.symbol
		: '0';
};

const Dashboard = () => {
	const [filter, setFilter] = useState('this_year');

	const getDashboardData = async (filter = 'this_year') => {
		const url = `/api/admin/dashboard`;

		const response = await axios.post(url, { filter: filter });

		return response;
	};

	const dashboardData = useQuery(
		['dashboard', filter],
		() => getDashboardData(filter),
		{
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

		*/
			onError: async (error) => {
				const message = error?.response?.data?.message;
				toast.error(message);

				if (message?.toLowerCase() === 'unauthenticated.') {
					await signOut({ callbackUrl: '/authentication' });
				}
			},

			//staleTime: 500000,
		}
	);

	const DASHBOARD_DATA = dashboardData?.data?.data?.data
		? dashboardData?.data?.data?.data
		: null;

	return (
		<div className="tw-w-full tw-min-h-screen tw-bg-[#FEFBFB] tw-py-20 lg:tw-pt-20 lg:tw-pl-56 tw-overflow-hidden">
			<DashboardNav />
			<div className="tw-w-full tw-h-full tw-py-10 tw-px-6 md:tw-px-12 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-10">
				<div className="tw-w-full tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-gap-6">
					<h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold tw-shrink-0">
						Welcome
					</h2>

					<div className="tw-w-fit tw-flex tw-justify-center tw-items-center tw-gap-3">
						<div
							onClick={() => setFilter('this_week')}
							className={`tw-group tw-transition-all tw-text-sm tw-duration-200 tw-ease-in-out tw-p-1 tw-px-2 tw-rounded-md hover:tw-bg-[#8D69BF] hover:tw-text-white ${
								filter === 'this_week'
									? 'tw-bg-[#8D69BF] tw-text-white'
									: 'tw-bg-[#FFECF4] tw-text-[#8D69BF]'
							} tw-cursor-pointer`}>
							This week
						</div>
						<div
							onClick={() => setFilter('this_month')}
							className={`tw-group tw-transition-all tw-text-sm tw-duration-200 tw-ease-in-out tw-p-1 tw-px-2 tw-rounded-md hover:tw-bg-[#8D69BF] hover:tw-text-white ${
								filter === 'this_month'
									? 'tw-bg-[#8D69BF] tw-text-white'
									: 'tw-bg-[#FFECF4] tw-text-[#8D69BF]'
							} tw-cursor-pointer`}>
							This month
						</div>
						<div
							onClick={() => setFilter('this_year')}
							className={`tw-group tw-transition-all tw-text-sm tw-duration-200 tw-ease-in-out tw-p-1 tw-px-2 tw-rounded-md hover:tw-bg-[#8D69BF] hover:tw-text-white ${
								filter === 'this_year'
									? 'tw-bg-[#8D69BF] tw-text-white'
									: 'tw-bg-[#FFECF4] tw-text-[#8D69BF]'
							} tw-cursor-pointer`}>
							This year
						</div>
					</div>
				</div>

				{!dashboardData.isLoading && DASHBOARD_DATA ? (
					<>
						<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-5 tw-place-content-start tw-place-items-start">
							<Link href="/immigration/stats/?selectedQuery=all" passHref>
								<div
									className={`tw-group tw-cursor-pointer tw-transition tw-duration-200 tw-ease-in-out hover:tw-shadow-lg tw-w-full tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5`}>
									<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
										<span
											className={`tw-font-light tw-cursor-pointer tw-text-sm tw-w-full tw-text-right`}>
											All Processed Applications
										</span>
									</div>
									<div className="tw-w-full tw-flex tw-justify-start tw-items-center">
										<h3
											className={`tw-font-medium tw-cursor-pointer tw-text-5xl tw-text-[#7862AF]`}>
											{nFormatter(DASHBOARD_DATA?.travelers_count)}
										</h3>
									</div>
								</div>
							</Link>
							<Link href="/immigration/stats/?selectedQuery=verified" passHref>
								<div
									className={`tw-group tw-cursor-pointer tw-transition tw-duration-200 tw-ease-in-out hover:tw-shadow-lg tw-w-full tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5`}>
									<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
										<span
											className={`tw-font-light tw-cursor-pointer tw-text-sm tw-w-full tw-text-right`}>
											Verified Applications
										</span>
									</div>
									<div className="tw-w-full tw-flex tw-justify-start tw-items-center">
										<h3
											className={`tw-font-medium tw-cursor-pointer tw-text-5xl tw-text-green-500`}>
											{nFormatter(DASHBOARD_DATA?.verified_travelers_count)}
										</h3>
									</div>
								</div>
							</Link>
							<Link href="/immigration/stats?selectedQuery=declined" passHref>
								<div
									className={`tw-group tw-cursor-pointer tw-transition tw-duration-200 tw-ease-in-out hover:tw-shadow-lg tw-w-full tw-h-fit
								tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5`}>
									<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
										<span
											className={`tw-font-light tw-cursor-pointer tw-text-sm tw-w-full tw-text-right `}>
											Declined Applications
										</span>
									</div>
									<div className="tw-w-full tw-flex tw-justify-start tw-items-center">
										<h3
											className={`tw-font-medium tw-cursor-pointer tw-text-5xl tw-text-red-500`}>
											{nFormatter(DASHBOARD_DATA?.declined_travelers_count)}
										</h3>
									</div>
								</div>
							</Link>
						</div>

						<div className="tw-w-full tw-grid tw-grid-cols-1 xl:tw-grid-cols-3 tw-gap-5 tw-place-content-center tw-place-items-start">
							<div className="tw-col-span-1 lg:tw-col-span-2 tw-hidden md:tw-block tw-w-full">
								<LineChart
									chartData={DASHBOARD_DATA?.chart}
									chartType={filter}
								/>
							</div>

							<div
								className={`tw-transition tw-duration-200 tw-ease-in-out hover:tw-shadow-lg tw-w-full tw-h-full tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-5`}>
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-pb-5">
									<h3
										className={`tw-font-medium tw-text-2xl tw-text-[#7862AF]`}>
										Top 5 Visiting Countries
									</h3>
								</div>
								{DASHBOARD_DATA?.top_countries?.map(
									({ travelers_count, country }, index) => (
										<div
											key={index}
											className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-3">
											<div className="tw-w-fit tw-flex tw-justify-start tw-items-center tw-gap-3">
												<span className="tw-group tw-transition-all tw-duration-200 tw-ease-in-out tw-p-1 tw-w-7 tw-h-7 tw-rounded-full tw-bg-[#FFECF4] tw-text-[#8D69BF] tw-font-medium tw-flex tw-justify-center tw-items-center">
													{index + 1}
												</span>
												<p
													className={`tw-font-normal tw-text-base tw-capitalize`}>
													{country}
												</p>
											</div>
											<p
												className={`tw-text-[#7862AF] tw-font-medium tw-text-lg tw-capitalize`}>
												{nFormatter(travelers_count)}{' '}
												<em className="tw-text-sm tw-font-normal tw-text-gray-500">
													travellers
												</em>
											</p>
										</div>
									)
								)}
							</div>
						</div>
					</>
				) : null}

				{/**
				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={open}>
					<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
						<CircularProgress color="inherit" />
						<p className="tw-text-white tw-font-medium tw-text-center tw-text-lg tw-w-2/3">
							Please wait...
						</p>
					</div>
				</Backdrop>
				 */}

				{dashboardData.isLoading && (
					<>
						<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-5 tw-place-content-start tw-place-items-start">
							<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
								<Stack spacing={1} sx={{ width: '100%' }}>
									<div className="tw-w-full tw-flex tw-justify-end">
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '40%' }}
										/>
									</div>
									<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
										<Skeleton
											variant="text"
											sx={{ fontSize: '3rem', width: '45%' }}
										/>
									</div>
								</Stack>
							</div>
							<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
								<Stack spacing={1} sx={{ width: '100%' }}>
									<div className="tw-w-full tw-flex tw-justify-end">
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '40%' }}
										/>
									</div>
									<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
										<Skeleton
											variant="text"
											sx={{ fontSize: '3rem', width: '45%' }}
										/>
									</div>
								</Stack>
							</div>
							<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
								<Stack spacing={1} sx={{ width: '100%' }}>
									<div className="tw-w-full tw-flex tw-justify-end">
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '40%' }}
										/>
									</div>
									<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
										<Skeleton
											variant="text"
											sx={{ fontSize: '3rem', width: '45%' }}
										/>
									</div>
								</Stack>
							</div>
						</div>

						<div className="tw-w-full tw-grid tw-grid-cols-1 xl:tw-grid-cols-3 tw-gap-5 tw-place-content-center tw-place-items-start">
							<div className="tw-col-span-1 lg:tw-col-span-2 tw-hidden md:tw-block tw-w-full">
								<Skeleton
									variant="rounded"
									sx={{ width: '100%', height: '350px' }}
								/>
							</div>

							<div
								className={`tw-transition tw-duration-200 tw-ease-in-out hover:tw-shadow-lg tw-w-full tw-h-full tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-5`}>
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
									<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
										<Skeleton
											variant="text"
											sx={{ fontSize: '2rem', width: '45%' }}
										/>
									</div>
								</div>
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-3">
									<div className="tw-w-3/5 tw-flex tw-justify-start tw-items-center tw-gap-3">
										<Skeleton
											variant="circular"
											sx={{ height: '30px', width: '35px' }}
										/>
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '100%' }}
										/>
									</div>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '30%' }}
									/>
								</div>
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-3">
									<div className="tw-w-3/5 tw-flex tw-justify-start tw-items-center tw-gap-3">
										<Skeleton
											variant="circular"
											sx={{ height: '30px', width: '35px' }}
										/>
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '100%' }}
										/>
									</div>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '30%' }}
									/>
								</div>
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-3">
									<div className="tw-w-3/5 tw-flex tw-justify-start tw-items-center tw-gap-3">
										<Skeleton
											variant="circular"
											sx={{ height: '30px', width: '35px' }}
										/>
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '100%' }}
										/>
									</div>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '30%' }}
									/>
								</div>
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-3">
									<div className="tw-w-3/5 tw-flex tw-justify-start tw-items-center tw-gap-3">
										<Skeleton
											variant="circular"
											sx={{ height: '30px', width: '35px' }}
										/>
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '100%' }}
										/>
									</div>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '30%' }}
									/>
								</div>
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-3">
									<div className="tw-w-3/5 tw-flex tw-justify-start tw-items-center tw-gap-3">
										<Skeleton
											variant="circular"
											sx={{ height: '30px', width: '35px' }}
										/>
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '100%' }}
										/>
									</div>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '30%' }}
									/>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
