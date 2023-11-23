'use client';

import React, { useEffect, useState } from 'react';
import DashboardNav from '@/components/Layout/Navigations/DashboardNav';
import { addDays, differenceInDays, format, isEqual, parseISO } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import Accordion from '@/components/Accordion';
import { planTabsData } from 'data/plansData';
import { Controller, useForm } from 'react-hook-form';
import {
	Backdrop,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	FormHelperText,
	Skeleton,
	Stack,
} from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useAxiosAuth from 'hooks/useAxiosAuth';
import { AiOutlineFilePdf } from 'react-icons/ai';
//import { axiosPrivate } from 'pages/api/axios';
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

const ManagePolicy = () => {
	const axiosPrivate = useAxiosAuth();

	const queryClient = useQueryClient();

	const [managePolicy, setManagePolicy] = useState(false);
	const [paymentAmount, setPaymentAmount] = useState(0);
	const [dateState, setDateState] = useState([
		{
			startDate: addDays(new Date(), 30),
			endDate: addDays(new Date(), 30),
			key: 'selection',
		},
	]);

	let duration = Number(
		differenceInDays(
			new Date(dateState[0].endDate),
			new Date(dateState[0].startDate)
		) + 1
	);

	useEffect(() => {
		if (duration <= 30) {
			setPaymentAmount(45);
			//setPaymentDiscount(0);
		} else if (duration > 30 && duration <= 60) {
			setPaymentAmount(90);
			//setPaymentDiscount(10);
		} else if (duration > 60 && duration <= 90) {
			setPaymentAmount(135);
			//setPaymentDiscount(15);
		} else if (duration > 90 && duration <= 120) {
			setPaymentAmount(180);
			//setPaymentDiscount(20);
		} else if (duration > 120 && duration <= 150) {
			setPaymentAmount(225);
			//setPaymentDiscount(25);
		} else if (duration > 150 && duration <= 180) {
			setPaymentAmount(270);
			//setPaymentDiscount(30);
		}
	}, [duration]);

	const { reset, watch, control, handleSubmit } = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			confirm_extension: false,
		},
	});

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

	useEffect(() => {
		if (USER_DETAILS) {
			setDateState([
				{
					startDate: addDays(
						new Date(USER_DETAILS?.user_policy_transaction?.end_date),
						1
					),
					endDate: addDays(
						new Date(USER_DETAILS?.user_policy_transaction?.end_date),
						30
					),
					key: 'selection',
				},
			]);
		}
	}, [USER_DETAILS]);

	const submitExtendPolicy = async (data) => {
		const { data: response } = await axiosPrivate.put(
			'/account/extend-policy',
			data
		);
		return response;
	};

	const extendPolicy = useMutation(
		(extensionData) => submitExtendPolicy(extensionData),
		{
			onSuccess: (data) => {
				if (data?.status === 200) {
					//window.location.replace(data.redirect_url);
					alert('Success', data?.message, 'success');
					reset();
					queryClient.invalidateQueries({ queryKey: ['user'] });
					setManagePolicy(false);
				} else if (data?.status !== 200) {
					alert('Failed to extend policy', 'Please try again later', 'error');
				}
			},
			onError: (error) => {
				console.log(error);
			},
		}
	);

	const submitExtensionRequest = (data) => {
		const extensionData = {
			extension_start_date: format(dateState[0]?.startDate, 'yyyy-MM-dd'),
			extension_end_date: format(dateState[0]?.endDate, 'yyyy-MM-dd'),
			extension_duration: duration,
			extension_price: paymentAmount,
		};

		let rightExtensionStartDate = isEqual(
			parseISO(format(new Date(dateState[0]?.startDate), 'yyyy-MM-dd')),
			parseISO(
				format(
					addDays(new Date(USER_DETAILS?.user_policy_transaction?.end_date), 1),
					'yyyy-MM-dd'
				)
			)
		);

		if (!rightExtensionStartDate) {
			alert(
				'Invalid Extension Start Date',
				'Extension must start from a day after current coverage end date',
				'error'
			);
		} else {
			extendPolicy.mutate(extensionData);
		}
	};

	return (
		<div className="tw-w-screen tw-min-h-screen tw-bg-[#FEFBFB] tw-py-20 lg:tw-pt-20 lg:tw-pl-56">
			<DashboardNav />
			<div className="tw-w-full tw-h-full tw-py-10 tw-px-6 md:tw-px-12 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-10">
				<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
					<h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold">
						Manage Policy
					</h2>
				</div>

				<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-5 tw-place-content-start tw-place-items-start">
					<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm xl:tw-col-span-2 tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
						<div className="tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-3">
							<a
								href="#"
								target="_blank"
								rel="noreferrer"
								className="tw-group tw-w-full tw-flex tw-justify-start tw-items-center tw-gap-1 tw-pb-3 tw-mt-8">
								<AiOutlineFilePdf />
								<p className="tw-font-bold !tw-text-sm tw-text-[#8e6abf] hover:tw-underline">
									Plan Brochure
								</p>
							</a>
							<Accordion questionsAnswers={planTabsData} />
						</div>
					</div>

					{!userDetails.isLoading && USER_DETAILS && (
						<div className="tw-w-full tw-h-fit tw-row-start-1 md:tw-col-start-2 tw-row-span-2 lg:tw-row-span-1 xl:tw-col-start-3 xl:tw-row-start-1 xl:tw-row-span-2 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<div className="tw-w-full tw-h-fit tw-bg-white tw-text-[#8e6abf] tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
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
												new Date(
													USER_DETAILS?.user_policy_transaction?.end_date
												),
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
									{USER_DETAILS?.user_policy_transaction
										?.extension_start_date ? (
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
										<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
											Price
										</div>
										<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-xl tw-text-[#8e6abf] tw-font-bold">
											{Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(
												USER_DETAILS?.user_policy_transaction?.price
											)}{' '}
										</span>
									</div>
								</div>
							</div>

							<div className="tw-w-full tw-flex tw-justify-end tw-items-end">
								<button
									className="btn-style-one dark-green-color"
									onClick={() => setManagePolicy(true)}
									type="button">
									Extend Policy <i className="bx bx-chevron-right"></i>
								</button>
							</div>
						</div>
					)}

					{userDetails.isLoading && (
						<div className="tw-w-full tw-h-fit tw-row-start-1 tw-col-start-2 tw-row-span-2 lg:tw-row-span-1 xl:tw-col-start-3 xl:tw-row-start-1 xl:tw-row-span-2 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<div className="tw-w-full tw-h-fit tw-bg-white tw-text-[#8e6abf] tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
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
										sx={{ fontSize: '2rem', width: '100%' }}
									/>
									<Skeleton
										variant="text"
										sx={{ fontSize: '2rem', width: '100%' }}
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

			{managePolicy && (
				<div
					onClick={() => setManagePolicy((prev) => !prev)}
					className="tw-fixed tw-top-0 tw-left-0 tw-z-[999] tw-flex tw-justify-center tw-items-center tw-w-screen tw-h-screen tw-bg-black/50">
					<div
						data-aos="zoom-in"
						data-aos-duration="600"
						onClick={(e) => e.stopPropagation()}
						className="tw-font-medium tw-text-center tw-text-lg tw-w-5/6 md:tw-w-2/3 tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
						<div className="tw-w-full tw-hidden md:tw-flex tw-flex-col tw-gap-2 tw-py-3 tw-border-b-2">
							<h2 className="tw-w-full tw-font-medium tw-text-lg tw-text-[#524380] tw-flex tw-justify-start tw-items-end tw-pb-2 tw-border-b-2">
								Current Policy Details
							</h2>

							<div className="tw-grid tw-grid-cols-2">
								<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
									Effective Date
								</div>
								<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
									{format(
										new Date(USER_DETAILS?.user_policy_transaction?.start_date),
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
										{USER_DETAILS?.user_policy_transaction?.extension_duration}{' '}
										days
									</p>
								</div>
							) : null}
							<div className="tw-grid tw-grid-cols-2">
								<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-600">
									Price
								</div>
								<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-900 tw-font-bold">
									{Intl.NumberFormat('en-US', {
										style: 'currency',
										currency: 'USD',
									}).format(USER_DETAILS?.user_policy_transaction?.price)}
								</p>
							</div>
						</div>
						<div className="tw-w-full">
							<form onSubmit={handleSubmit(submitExtensionRequest)}>
								<div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-pb-3">
									<h2 className="tw-w-full tw-font-medium tw-text-lg tw-text-[#524380] tw-flex tw-justify-start tw-items-end">
										Extension Period
									</h2>

									<div className="tw-w-full tw-h-fit tw-flex tw-flex-col lg:tw-flex-row tw-justify-center tw-gap-4 tw-items-center tw-border-y-2 tw-px-2 tw-py-3">
										<div className="tw-w-full md:tw-w-fit tw-flex tw-justify-center lg:tw-justify-start tw-items-center tw-gap-2 tw-shrink-0">
											<div className="xl:tw-block tw-hidden">
												<DateRange
													months={2}
													direction="horizontal"
													editableDateInputs={true}
													onChange={(item) => setDateState([item.selection])}
													moveRangeOnFirstSelection={false}
													ranges={dateState}
													rangeColors={['#8e6abf']}
													minDate={
														new Date(
															USER_DETAILS?.user_policy_transaction?.end_date
														)
													}
													maxDate={addDays(dateState[0].startDate, 179)}
													className="tw-rounded-md tw-shadow-md"
												/>
											</div>
											<div className="xl:tw-hidden tw-block">
												<DateRange
													editableDateInputs={true}
													onChange={(item) => setDateState([item.selection])}
													moveRangeOnFirstSelection={false}
													ranges={dateState}
													rangeColors={['#8e6abf']}
													minDate={
														new Date(
															USER_DETAILS?.user_policy_transaction?.end_date
														)
													}
													maxDate={addDays(dateState[0].startDate, 179)}
													className="tw-rounded-md tw-shadow-md"
												/>
											</div>
										</div>
										<div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center lg:tw-ml-10">
											<div className="tw-hidden lg:tw-grid tw-grid-cols-2 tw-w-full tw-pb-2">
												<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600">
													Extension Starts
												</div>
												<p className="tw-w-full tw-flex tw-justify-end tw-text-base tw-text-[#524380] tw-font-bold">
													{format(
														new Date(dateState[0].startDate),
														'MMM dd, yyyy'
													)}
												</p>
											</div>
											<div className="tw-hidden lg:tw-grid tw-grid-cols-2 tw-w-full tw-pb-2">
												<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600">
													Extension Ends
												</div>
												<p className="tw-w-full tw-flex tw-justify-end tw-text-base tw-text-[#524380] tw-font-bold">
													{format(
														new Date(dateState[0].endDate),
														'MMM dd, yyyy'
													)}
												</p>
											</div>
											<div className="tw-grid tw-grid-cols-2 tw-w-full tw-pb-2">
												<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600">
													Duration
												</div>
												<p className="tw-w-full tw-flex tw-justify-end tw-text-base tw-text-[#524380] tw-font-bold">
													{differenceInDays(
														new Date(dateState[0].endDate),
														new Date(dateState[0].startDate)
													) + 1}{' '}
													day(s)
												</p>
											</div>
											<div className="tw-grid tw-grid-cols-2 tw-w-full tw-pb-2">
												<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600">
													Price
												</div>
												<p className="tw-w-full tw-flex tw-justify-end tw-text-base tw-text-[#524380] tw-font-bold">
													{duration &&
														Intl.NumberFormat('en-US', {
															style: 'currency',
															currency: 'USD',
														}).format(
															duration <= 30
																? 45
																: duration > 30 && duration <= 60
																? 90
																: duration > 60 && duration <= 90
																? 135
																: duration > 90 && duration <= 120
																? 180
																: duration > 120 && duration <= 150
																? 225
																: duration > 150 && duration <= 180 && 270
														)}{' '}
												</p>
											</div>
										</div>
									</div>
									<div className="tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start">
										<Controller
											control={control}
											name={'confirm_extension'}
											defaultValue={false}
											rules={{
												required: 'Please confirm before continuing',
											}}
											render={({
												field: { ref, ...field },
												fieldState: { error, invalid },
											}) => (
												<>
													<FormControlLabel
														control={
															<Checkbox
																{...field}
																ref={ref}
																color="secondary"
																checked={watch(`confirm_extension`)}
															/>
														}
														label={`Confirm policy extension by ${
															differenceInDays(
																new Date(dateState[0].endDate),
																new Date(dateState[0].startDate)
															) + 1
														} day(s) for ${
															duration &&
															Intl.NumberFormat('en-US', {
																style: 'currency',
																currency: 'USD',
															}).format(
																duration <= 30
																	? 45
																	: duration > 30 && duration <= 60
																	? 90
																	: duration > 60 && duration <= 90
																	? 135
																	: duration > 90 && duration <= 120
																	? 180
																	: duration > 120 && duration <= 150
																	? 225
																	: duration > 150 && duration <= 180 && 270
															)
														}`}
													/>
													<FormHelperText error>
														{invalid ? error.message : null}
													</FormHelperText>
												</>
											)}
										/>
									</div>

									<div className="tw-w-full tw-flex tw-justify-end tw-items-end">
										<button
											className="btn-style-one dark-green-color"
											type="submit">
											Extend <i className="bx bx-chevron-right"></i>
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={extendPolicy.isLoading}>
				<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
					<CircularProgress color="inherit" />
					<p className="tw-text-white tw-font-medium tw-text-center tw-text-lg tw-w-2/3">
						Extending current policy, please wait...
					</p>
				</div>
			</Backdrop>
		</div>
	);
};

export default ManagePolicy;
