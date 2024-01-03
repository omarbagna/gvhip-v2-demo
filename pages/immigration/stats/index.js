'use client';

import React, { useState } from 'react';
import DashboardNav from '@/components/Layout/Navigations/DashboardNav';
import { Chip, Skeleton, Stack } from '@mui/material';
import { useQuery } from 'react-query';

import baseUrl from '@/utils/baseUrl';
import axios from 'axios';
import StatsTable from '@/components/Table/StatsTable';
import dayjs from 'dayjs';
import { useStateContext } from 'context/StateContext';
import { AiOutlineClose } from 'react-icons/ai';
import { differenceInDays } from 'date-fns';
import { useRouter } from 'next/router';
import BlurImage from '@/components/BlurImage/BlurImage';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';

const columns = [
	{
		Header: 'Full name',
		accessor: 'full_name',
	},
	{
		Header: 'Policy number',
		accessor: 'policy_number',
	},
	{
		Header: 'Country',
		accessor: 'country',
	},
	{
		Header: 'Coverage start',
		accessor: 'user_policy_transaction[0].start_date',
		disableFilters: true,
		disableSortBy: false,
		Cell: ({ value }) => {
			if (value) {
				return dayjs(value).format('DD MMM YYYY');
			}
		},
	},
	{
		Header: 'Coverage Expires',
		accessor: 'user_policy_transaction[0].end_date',
		disableFilters: true,
		disableSortBy: false,
		Cell: ({ value }) => {
			if (value) {
				return dayjs(value).format('DD MMM YYYY');
			}
		},
	},
	{
		Header: 'Status',
		accessor: 'trip_status',
		Cell: ({ value }) => {
			if (value) {
				return (
					<Chip
						label={value?.toUpperCase()}
						size="small"
						variant="filled"
						color={
							value.toUpperCase() === 'DECLINED'
								? 'error'
								: value.toUpperCase() === 'VERIFIED'
								? 'success'
								: 'secondary'
						}
					/>
				);
			}
		},
	},
];

const Statistics = () => {
	const router = useRouter();
	const { selectedQuery } = router.query;
	const {
		viewTraveller,
		setViewTraveller,
		viewTravellerData,
		setViewTravellerData,
	} = useStateContext();

	const [selected, setSelected] = useState(
		selectedQuery ? selectedQuery : 'all'
	);
	const [filter, setFilter] = useState('this_year');

	const getStatisticsData = async (filter = 'this_year') => {
		const url = `${baseUrl}/api/admin/statistics`;

		const response = await axios.post(url, filter);

		return response;
	};

	const statisticsData = useQuery(
		['stats', filter],
		() => getStatisticsData(filter),
		{
			onError: async (error) => {
				const message = error?.response?.data?.message;
				toast.error(message);

				if (message?.toLowerCase() === 'unauthenticated.') {
					await signOut({ callbackUrl: '/authentication' });
				}
			},
		}
	);

	const STATISTICS_DATA = statisticsData?.data?.data?.data
		? statisticsData?.data?.data?.data
		: null;

	return (
		<div className="tw-w-full tw-min-h-screen tw-bg-[#FEFBFB] tw-py-20 lg:tw-pt-20 lg:tw-pl-56">
			<DashboardNav />
			<div className="tw-w-full tw-h-full tw-py-10 tw-px-6 md:tw-px-12 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-10">
				<div className="tw-w-full tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-gap-6">
					<h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold">
						Processing Stats
					</h2>

					{statisticsData.isLoading ? (
						<div className="tw-w-fit tw-flex tw-justify-center tw-items-center tw-gap-3">
							<Skeleton
								variant="text"
								sx={{ fontSize: '2rem', width: '70px' }}
							/>
							<Skeleton
								variant="text"
								sx={{ fontSize: '2rem', width: '70px' }}
							/>
							<Skeleton
								variant="text"
								sx={{ fontSize: '2rem', width: '70px' }}
							/>
						</div>
					) : (
						<div className="tw-w-fit tw-flex tw-justify-center tw-items-center tw-gap-3">
							<div
								onClick={() => setFilter('today')}
								className={`tw-group tw-transition-all tw-text-sm tw-duration-200 tw-ease-in-out tw-p-1 tw-px-2 tw-rounded-md hover:tw-bg-[#8D69BF] hover:tw-text-white ${
									filter === 'today'
										? 'tw-bg-[#8D69BF] tw-text-white'
										: 'tw-bg-[#FFECF4] tw-text-[#8D69BF]'
								} tw-cursor-pointer`}>
								Today
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
					)}
				</div>

				{!statisticsData.isLoading && STATISTICS_DATA && (
					<>
						<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-5">
							<div
								onClick={() => setSelected('all')}
								className={`tw-group tw-cursor-pointer tw-transition tw-duration-200 tw-ease-in-out hover:tw-shadow-lg tw-w-full tw-h-fit ${
									selected === 'all'
										? 'tw-bg-[#7862AF] tw-shadow-lg tw-shadow-[#7862AF]/30'
										: 'tw-bg-white tw-shadow-sm'
								} tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5`}>
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
									<span
										className={`tw-font-light tw-cursor-pointer tw-text-sm tw-w-full tw-text-right ${
											selected === 'all' ? 'tw-text-gray-200' : ''
										}`}>
										All Processed Applications
									</span>
								</div>
								<div className="tw-w-full tw-flex tw-justify-start tw-items-center">
									<h3
										className={`tw-font-medium tw-cursor-pointer tw-text-3xl lg:tw-text-5xl ${
											selected === 'all' ? 'tw-text-white' : 'tw-text-[#7862AF]'
										}`}>
										{STATISTICS_DATA?.travelers_count}
									</h3>
								</div>
							</div>
							<div
								onClick={() => setSelected('verified')}
								className={`tw-group tw-cursor-pointer tw-transition tw-duration-200 tw-ease-in-out hover:tw-shadow-lg tw-w-full tw-h-fit ${
									selected === 'verified'
										? 'tw-bg-[#7862AF] tw-shadow-lg tw-shadow-[#7862AF]/30'
										: 'tw-bg-white tw-shadow-sm'
								} tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5`}>
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
									<span
										className={`tw-font-light tw-cursor-pointer tw-text-sm tw-w-full tw-text-right ${
											selected === 'verified' ? 'tw-text-gray-200' : ''
										}`}>
										Verified Applications
									</span>
								</div>
								<div className="tw-w-full tw-flex tw-justify-start tw-items-center">
									<h3
										className={`tw-font-medium tw-cursor-pointer tw-text-3xl lg:tw-text-5xl ${
											selected === 'verified'
												? 'tw-text-white'
												: 'tw-text-green-500'
										}`}>
										{STATISTICS_DATA?.verified_travelers_count}
									</h3>
								</div>
							</div>
							<div
								onClick={() => setSelected('declined')}
								className={`tw-group tw-cursor-pointer tw-transition tw-duration-200 tw-ease-in-out hover:tw-shadow-lg tw-w-full tw-h-fit ${
									selected === 'declined'
										? 'tw-bg-[#7862AF] tw-shadow-lg tw-shadow-[#7862AF]/30'
										: 'tw-bg-white tw-shadow-sm'
								} tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5`}>
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
									<span
										className={`tw-font-light tw-cursor-pointer tw-text-sm tw-w-full tw-text-right ${
											selected === 'declined' ? 'tw-text-gray-200' : ''
										}`}>
										Declined Applications
									</span>
								</div>
								<div className="tw-w-full tw-flex tw-justify-start tw-items-center">
									<h3
										className={`tw-font-medium tw-cursor-pointer tw-text-3xl lg:tw-text-5xl ${
											selected === 'declined'
												? 'tw-text-white'
												: 'tw-text-red-500'
										}`}>
										{STATISTICS_DATA?.declined_travelers_count}
									</h3>
								</div>
							</div>
						</div>

						<StatsTable
							COLUMNS={columns}
							DATA={
								selected !== 'all'
									? STATISTICS_DATA?.recent_travelers?.filter(
											({ trip_status }) =>
												trip_status?.toLowerCase() === selected?.toLowerCase()
									  )
									: STATISTICS_DATA?.recent_travelers
							}
						/>
					</>
				)}

				{statisticsData.isLoading && (
					<>
						<div className="tw-w-full tw-grid tw-grid-cols-3 tw-gap-5">
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

						<div className="tw-w-full tw-grid tw-grid-cols-1 tw-gap-5">
							<div className="tw-w-full tw-h-fit tw-rounded-lg tw-py-5 tw-px-4 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
								<Stack spacing={1} sx={{ width: '100%' }}>
									<div className="tw-w-full tw-flex tw-justify-between tw-gap-3">
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '20%' }}
										/>
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '20%' }}
										/>
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '20%' }}
										/>
										<Skeleton
											variant="text"
											sx={{ fontSize: '1rem', width: '20%' }}
										/>
									</div>
									<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
										<div className="tw-w-full tw-flex tw-justify-between tw-gap-3">
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
										</div>
										<div className="tw-w-full tw-flex tw-justify-between tw-gap-3">
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
										</div>
										<div className="tw-w-full tw-flex tw-justify-between tw-gap-3">
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
										</div>
									</div>
								</Stack>
							</div>
						</div>
					</>
				)}

				{!statisticsData.isLoading && !STATISTICS_DATA && (
					<h2>Failed to load data. Please reload this page to try again</h2>
				)}
			</div>

			{viewTraveller && (
				<div
					className="tw-fixed tw-top-0 tw-left-0 tw-z-[999] tw-w-screen tw-h-screen tw-bg-black/20 tw-backdrop-blur-sm tw-flex tw-justify-center tw-items-center"
					onClick={() => {
						setViewTraveller(false);
						setViewTravellerData(null);
					}}>
					<div
						data-aos="zoom-in"
						data-aos-duration="800"
						className="tw-rounded-xl tw-bg-white tw-w-full md:tw-w-4/5 lg:tw-w-2/3 tw-h-full md:tw-h-fit tw-px-5 tw-py-10 tw-flex tw-flex-col overflow-auto"
						onClick={(e) => e.stopPropagation()}>
						<div className="section-title tw-flex !tw-max-w-full !tw-mx-5 tw-justify-between tw-items-center">
							<h2 className="nunito-font">Traveller Info</h2>

							<span
								className="tw-cursor-pointer btn-style-back crimson-color tw-rounded-full tw-flex tw-justify-center tw-items-center tw-w-8 tw-h-8 md:tw-w-12 md:tw-h-12 tw-p-2"
								onClick={() => {
									setViewTraveller(false);
									setViewTravellerData(null);
								}}>
								<AiOutlineClose className="tw-text-xl md:tw-text-3xl" />
							</span>
						</div>

						<div className="tw-w-full tw-h-full">
							{viewTravellerData && (
								<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
									<div className="tw-w-full tw-flex tw-justify-start tw-gap-4 tw-items-start">
										<BlurImage
											src={viewTravellerData?.policy_qr_code}
											alt="qr code"
											height={120}
											width={120}
										/>
										<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1 tw-pt-3">
											<h3 className="tw-font-semibold tw-text-lg md:tw-text-xl tw-text-[#8e6abf]">
												{viewTravellerData?.first_name}{' '}
												{viewTravellerData?.last_name}
											</h3>
											<div className="tw-w-full tw-flex tw-justify-start tw-items-end tw-gap-3">
												<div className="tw-w-fit tw-shrink-0 tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
													Passport number:
												</div>
												<p className="tw-uppercase tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600 tw-font-bold">
													{viewTravellerData?.passport_number}
												</p>
											</div>
											<div className="tw-w-full tw-flex tw-justify-start tw-items-end tw-gap-3">
												<div className="tw-w-fit tw-shrink-0 tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
													Policy number:
												</div>
												<p className="tw-uppercase tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600 tw-font-bold">
													{viewTravellerData?.policy_number}
												</p>
											</div>
										</div>
									</div>
									<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2 tw-py-3 tw-border-t">
										<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
											Bio Data
										</h2>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												First name
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{viewTravellerData?.first_name}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												Last name
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{viewTravellerData?.last_name}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												Date of Birth
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{dayjs(viewTravellerData?.dob).format('MMM DD, YYYY')}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												Gender
											</div>
											<p className="tw-w-full tw-capitalize tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{viewTravellerData?.gender}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
												Passport Number
											</div>
											<p className="tw-uppercase tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{viewTravellerData?.passport_number}
											</p>
										</div>
									</div>
									<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2 tw-py-3 tw-border-y">
										<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
											Travel details
										</h2>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												Country of Origin
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{viewTravellerData?.country}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												Effective Date
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{dayjs(
													viewTravellerData?.user_policy_transaction[0]
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
													viewTravellerData?.user_policy_transaction[0]
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
													viewTravellerData?.user_policy_transaction[0]
														?.duration
												}{' '}
												Days
											</p>
										</div>
									</div>
									<div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
												Policy Name
											</div>
											<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-sm tw-text-[#8e6abf] tw-font-bold">
												{
													viewTravellerData?.user_policy_transaction[0]
														?.travel_plan?.plan_name
												}
											</span>
										</div>
										{viewTravellerData?.user_policy_transaction[0]
											?.extension_start_date ? (
											<div className="tw-grid tw-grid-cols-2">
												<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
													Extension status
												</div>
												<p className="tw-capitalize tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-green-500 tw-font-bold">
													Extended
												</p>
											</div>
										) : null}
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
												Expires in
											</div>
											<p
												className={`tw-capitalize tw-w-full tw-flex tw-justify-end tw-text-base ${
													Number(
														differenceInDays(
															new Date(
																viewTravellerData?.user_policy_transaction[0]
																	?.extension_end_date
																	? viewTravellerData
																			?.user_policy_transaction[0]
																			?.extension_end_date
																	: viewTravellerData
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
												{Number(
													differenceInDays(
														new Date(
															viewTravellerData?.user_policy_transaction[0]
																?.extension_end_date
																? viewTravellerData?.user_policy_transaction[0]
																		?.extension_end_date
																: viewTravellerData?.user_policy_transaction[0]
																		?.end_date
														),
														new Date()
													)
												) + 1}{' '}
												days
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
													viewTravellerData?.user_policy_transaction[0]?.price
												)}{' '}
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Statistics;
