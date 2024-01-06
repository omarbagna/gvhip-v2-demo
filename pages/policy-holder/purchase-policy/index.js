'use client';

import React, { useEffect, useState } from 'react';
import DashboardNav from '@/components/Layout/Navigations/DashboardNav';
import { addDays } from 'date-fns';
import { countries } from '../../../data/countriesData';
import Accordion from '@/components/Accordion';
import { planTabsData } from 'data/plansData';
import { Controller, useForm } from 'react-hook-form';
import {
	Backdrop,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Skeleton,
	Typography,
} from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { MdEdit } from 'react-icons/md';
import SelectInput from '@/components/Input/SelectInput';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DependantArray from '@/components/Form/dependantArrayPolicyHolder';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { toast } from 'react-toastify';
import DefaultInput from '@/components/Input/DefaultInput';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const PurchasePolicy = () => {
	const router = useRouter();

	const [showMore, setShowMore] = useState(false);
	const [formStep, setFormStep] = useState(1);
	const [pricing, setPricing] = useState({});

	const getUserDetails = async () => {
		const url = `/api/user/dashboard`;

		const response = await axios.get(url);

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
		*/

		onError: async (error) => {
			const message = error?.response?.data?.message;
			toast.error(message);

			if (message?.toLowerCase() === 'unauthenticated.') {
				await signOut({ callbackUrl: '/authentication' });
			}
		},
	});

	const USER_DETAILS = userDetails?.data?.data?.data
		? userDetails?.data?.data?.data
		: null;

	// Check if user has the right to access this page, if not send user back
	useEffect(() => {
		if (
			USER_DETAILS?.travelling_info?.user_policy_transaction[0]?.status ===
				'declined' ||
			USER_DETAILS?.travelling_info?.user_policy_transaction[0]?.status ===
				'expired'
		) {
			return;
		} else {
			router.back();
		}
	});

	// Fetch the pricing plans
	const getPricingPlans = async () => {
		const url = `/api/pricing-plans`;

		const response = await axios.get(url);
		return response;
	};

	const pricingPlans = useQuery('pricing-plans', getPricingPlans);

	const PRICING = pricingPlans?.data?.data ? pricingPlans?.data?.data : null;

	const DURATION_PRICING = PRICING?.map((item) => ({
		name: `${item?.duration} days at ${item?.price} USD (${item?.discount}% off)`,
		value: item?.duration,
	}));

	const handleShowDetails = () => {
		setShowMore((prev) => !prev);
	};

	// Function to calculate the amount payable for a traveller and the discount to be applied
	const calculatePrices = () => {
		let userPrice = {};
		let travelDurationPrice = null;

		/* 
		Calculate the the total number of people(dependants) 
		travelling with a single traveller, the duration of coverage, the discount to be applied and
		the amount to be paid per individual
		 */
		travelDurationPrice = PRICING?.filter(
			(price) => price?.duration === watch(`insured_person.duration`)
		);

		userPrice = {
			traveller_no: 1,
			no_of_travellers: watch('insured_person')?.dependants?.length + 1,
			discount: travelDurationPrice[0]?.discount,
			price: travelDurationPrice[0]?.price_after_discount,
			duration: travelDurationPrice[0]?.duration,
		};

		// Save the pricing information to the price state
		setPricing(userPrice);
	};

	const {
		watch,
		control,
		setValue,
		reset,
		trigger,
		formState: { isValid },
		handleSubmit,
	} = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			insured_person: {
				dependants: [],
			},
		},
	});

	const goToNext = () => {
		trigger();
		if (isValid) {
			calculatePrices();
			setFormStep((prev) => prev + 1);
		} else {
			toast.error('Please fill all required fields');
		}
	};

	const goToPrevious = () => {
		setFormStep((prev) => prev - 1);
	};

	const renderButton = () => {
		if (formStep > 2) {
			return null;
		} else if (formStep === 2) {
			return (
				<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-5">
					<span
						className="btn-style-back crimson-color tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-rotate-180 tw-shadow-md tw-justify-center tw-items-center tw-text-3xl"
						onClick={goToPrevious}>
						<i className="bx bx-chevron-right"></i>
					</span>
					<button className="btn-style-one dark-green-color" type="submit">
						Proceed to Payment <i className="bx bx-chevron-right"></i>
					</button>
				</div>
			);
		} else if (formStep === 1) {
			return (
				<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-5">
					<div />
					<button
						className="btn-style-one dark-green-color"
						onClick={() => {
							goToNext();
						}}
						type="button">
						Next <i className="bx bx-chevron-right"></i>
					</button>
				</div>
			);
		}
	};

	useEffect(() => {
		if (USER_DETAILS) {
			reset({
				insured_person: {
					...USER_DETAILS?.travelling_info,
					arrival_date: '',
					departure_date: '',
					dependants: USER_DETAILS?.dependants,
				},
			});

			let extensionOptionsValues = [
				{
					name: `${USER_DETAILS?.travelling_info?.first_name} ${USER_DETAILS?.travelling_info?.last_name}`,
					value: USER_DETAILS?.travelling_info?.policy_number,
					disabled: false,
				},
			];

			USER_DETAILS?.dependants?.map((value) => {
				return extensionOptionsValues.push({
					name: `${value.first_name} ${value.last_name}`,
					value: value.policy_number,
					disabled: false,
				});
			});

			let dates = [
				{
					policy_number: USER_DETAILS?.travelling_info?.policy_number,
					extension_start_date: USER_DETAILS?.travelling_info
						?.user_policy_transaction[0]?.extension_start_date
						? USER_DETAILS?.travelling_info?.user_policy_transaction[0]
								?.extension_start_date
						: USER_DETAILS?.travelling_info?.user_policy_transaction[0]
								?.start_date,
					extension_end_date: USER_DETAILS?.travelling_info
						?.user_policy_transaction[0]?.extension_end_date
						? USER_DETAILS?.travelling_info?.user_policy_transaction[0]
								?.extension_end_date
						: USER_DETAILS?.travelling_info?.user_policy_transaction[0]
								?.end_date,
					extension_duration: USER_DETAILS?.travelling_info
						?.user_policy_transaction[0]?.extension_duration
						? USER_DETAILS?.travelling_info?.user_policy_transaction[0]
								?.extension_duration
						: 0,
					initial_duration:
						USER_DETAILS?.travelling_info?.user_policy_transaction[0]?.duration,
				},
			];

			USER_DETAILS?.dependants?.map((value) => {
				return dates.push({
					policy_number: value.policy_number,
					extension_start_date: value?.user_policy_transaction[0]
						?.extension_start_date
						? value.user_policy_transaction[0]?.extension_start_date
						: value.user_policy_transaction[0]?.start_date,
					extension_end_date: value?.user_policy_transaction[0]
						?.extension_end_date
						? value.user_policy_transaction[0]?.extension_end_date
						: value.user_policy_transaction[0]?.end_date,
					extension_duration: value?.travelling_info?.user_policy_transaction[0]
						?.extension_duration
						? value.user_policy_transaction[0]?.extension_duration
						: 0,
					initial_duration: value?.user_policy_transaction[0]?.duration,
				});
			});
		}
	}, [USER_DETAILS, reset]);

	// Send payment request
	const paymentRequest = async (data) => {
		const url = `/api/user/purchase-new-plan`;

		const { data: response } = await axios.post(url, data);
		return response;
	};

	const makePayment = useMutation(
		(paymentData) => paymentRequest(paymentData),
		{
			onSuccess: (data) => {
				if (data?.status === 200) {
					toast.success('Submitted');
					toast('Redirecting', {
						position: 'top-right',
						autoClose: 6000,
						hideProgressBar: false,
						closeOnClick: false,
						pauseOnHover: false,
						draggable: false,
						progress: undefined,
						theme: 'light',
					});

					window.location.replace(data?.checkoutUrl);
				} else {
					if (!data?.success) {
						Object.values(data?.data).map((value) => {
							return toast.error(value[0]);
						});
					}
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data?.message);
			},
		}
	);

	const submitForm = (data) => {
		let totalPayable = 0;

		// Calculate the total amount to be paid from the prices generated and saved for each traveller
		totalPayable += pricing?.price * pricing?.no_of_travellers;

		// Combine all the necessary information to be sent to the backend
		const finalData = {
			policy_number: data.insured_person?.policy_number,
			first_name: data.insured_person?.first_name,
			last_name: data.insured_person?.last_name,
			telephone: data.insured_person?.telephone,
			country: data.insured_person?.country,
			address: data.insured_person?.address,
			arrival_date: dayjs(data.insured_person?.arrival_date).format(
				'YYYY-MM-DD'
			),
			departure_date: dayjs(data.insured_person?.departure_date).format(
				'YYYY-MM-DD'
			),
			dependants:
				data.insured_person?.dependants?.length > 0
					? data.insured_person?.dependants?.map((dependant) => ({
							country: data.insured_person?.country,
							policy_number: dependant?.policy_number,
							full_name: `${dependant?.first_name} ${dependant?.last_name}`,
							first_name: dependant?.first_name,
							last_name: dependant?.last_name,
							email: dependant?.email,
							telephone: dependant?.telephone,
							gender: dependant?.gender,
							dob: dayjs(dependant?.dob).format('YYYY-MM-DD'),
							passport_number: dependant?.passport_number,
							address: data.insured_person?.address,
							arrival_date: dayjs(data.insured_person?.arrival_date).format(
								'YYYY-MM-DD'
							),
							departure_date: dayjs(data.insured_person?.departure_date).format(
								'YYYY-MM-DD'
							),
							price: pricing?.price,
							duration: pricing?.duration,
							discount: pricing?.discount,
					  }))
					: [],

			duration: pricing?.duration,
			price: pricing?.price,
			discount: pricing?.discount,
			total_price: totalPayable,
		};

		// Submit the plan purchase request
		makePayment.mutate(finalData);
	};

	return (
		<div className="tw-max-w-screen tw-min-h-screen tw-bg-[#FEFBFB] tw-py-20 lg:tw-pt-20 lg:tw-pl-56">
			<DashboardNav />
			<div className="tw-w-full tw-h-full tw-py-10 tw-px-6 md:tw-px-12 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-10">
				<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
					<h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold">
						Purchase Policy
					</h2>
				</div>

				<div className="tw-w-full tw-flex tw-flex-col tw-gap-5 tw-justify-start tw-items-start">
					<div className="tw-w-full tw-px-4 tw-py-5 md:tw-px-8 md:tw-py-10">
						<form onSubmit={handleSubmit(submitForm)}>
							{/* Purchase form inputs */}
							{formStep === 1 && (
								<>
									<section className="tw-flex tw-flex-col tw-gap-8 tw-bg-white tw-border tw-border-b-black tw-rounded-lg tw-py-3 tw-px-8 tw-shadow-md">
										<div className="tw-flex tw-flex-col tw-gap-3">
											<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
												<div className="tw-grid tw-grid-cols-2 md:tw-flex tw-justify-start tw-items-start md:tw-items-center tw-gap-3 md:tw-gap-5">
													<h3 className="tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#171e41]">
														Traveller
													</h3>

													<span className="tw-bg-[#7862AF]/20 tw-w-fit tw-h-fit tw-px-3 tw-py-1 tw-rounded-lg">
														<Typography sx={{ color: '#7862AF' }}>
															Primary
														</Typography>
													</span>

													<Typography
														className="tw-col-span-2"
														sx={{ color: 'text.secondary' }}>
														{watch(`insured_person.first_name`)}{' '}
														{watch(`insured_person.last_name`)}
													</Typography>
												</div>
											</div>

											<div className="tw-relative tw-w-full tw-h-full tw-flex tw-flex-col tw-gap-5 tw-justify-center tw-items-center ">
												{/** Personal Information Area */}
												<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-10 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-y-2 tw-border-[#171e41] tw-py-10">
													<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
														Personal Information
													</h4>
													<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
														{userDetails.isLoading ? (
															<Skeleton
																variant="text"
																sx={{ fontSize: '3rem', width: '100%' }}
															/>
														) : (
															<Controller
																name={`insured_person.first_name`}
																control={control}
																defaultValue={''}
																rules={{
																	required: 'Please enter first name',
																}}
																render={({
																	field: { ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<DefaultInput
																		{...field}
																		ref={ref}
																		error={invalid}
																		name={`insured_person.first_name`}
																		helpertext={invalid ? error.message : null}
																		label="First Name"
																		type="text"
																		required
																		disabled
																	/>
																)}
															/>
														)}

														{userDetails.isLoading ? (
															<Skeleton
																variant="text"
																sx={{ fontSize: '3rem', width: '100%' }}
															/>
														) : (
															<Controller
																name={`insured_person.last_name`}
																control={control}
																defaultValue={''}
																rules={{
																	required: 'Please enter last name',
																}}
																render={({
																	field: { ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<DefaultInput
																		{...field}
																		ref={ref}
																		name={`insured_person.last_name`}
																		error={invalid}
																		helpertext={invalid ? error.message : null}
																		label="Last Name"
																		type="text"
																		required
																		disabled
																	/>
																)}
															/>
														)}
													</div>

													<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
														{userDetails.isLoading ? (
															<Skeleton
																variant="text"
																sx={{ fontSize: '3rem', width: '100%' }}
															/>
														) : (
															<Controller
																name={`insured_person.dob`}
																control={control}
																defaultValue={''}
																rules={{
																	required: 'Please specify date of birth',
																	valueAsDate: true,
																}}
																render={({
																	field: { value, onChange, ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<FormControl error={invalid}>
																		<LocalizationProvider
																			dateAdapter={AdapterDateFns}>
																			<DatePicker
																				{...field}
																				ref={ref}
																				name={`insured_person.dob`}
																				maxDate={new Date()}
																				value={new Date(value)}
																				onChange={(value) => {
																					if (value !== null) {
																						onChange(
																							dayjs(value).format('YYYY-MM-DD')
																						);
																					} else {
																						onChange('');
																					}
																				}}
																				label="Date of Birth"
																				format="dd/MM/yyyy"
																				disabled
																				slotProps={{
																					textField: {
																						placeholder: 'Date of Birth',
																					},
																				}}
																			/>
																		</LocalizationProvider>
																		<FormHelperText>
																			{invalid ? error.message : null}
																		</FormHelperText>
																	</FormControl>
																)}
															/>
														)}

														{userDetails.isLoading ? (
															<Skeleton
																variant="text"
																sx={{ fontSize: '3rem', width: '100%' }}
															/>
														) : (
															<Controller
																name={`insured_person.gender`}
																control={control}
																defaultValue={''}
																rules={{
																	required: 'Please select gender',
																}}
																render={({
																	field: { ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<SelectInput
																		{...field}
																		ref={ref}
																		name={`insured_person.gender`}
																		error={invalid}
																		helpertext={invalid ? error.message : null}
																		label="Gender"
																		options={[
																			{
																				name: 'Male',
																				value: 'Male',
																			},
																			{
																				name: 'Female',
																				value: 'Female',
																			},
																		]}
																		required
																		disabled
																	/>
																)}
															/>
														)}
													</div>

													<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
														{userDetails.isLoading ? (
															<Skeleton
																variant="text"
																sx={{ fontSize: '3rem', width: '100%' }}
															/>
														) : (
															<Controller
																control={control}
																name={`insured_person.country`}
																defaultValue={watch('country')}
																rules={{
																	required: 'Please select country',
																}}
																render={({
																	field: { ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<SelectInput
																		{...field}
																		ref={ref}
																		name={`insured_person.country`}
																		error={invalid}
																		helpertext={invalid ? error.message : null}
																		label="Country / Region"
																		options={countries}
																		required
																	/>
																)}
															/>
														)}

														{userDetails.isLoading ? (
															<Skeleton
																variant="text"
																sx={{ fontSize: '3rem', width: '100%' }}
															/>
														) : (
															<Controller
																name={`insured_person.passport_number`}
																control={control}
																defaultValue={''}
																rules={{
																	required: 'Please enter passport number',
																}}
																render={({
																	field: { ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<DefaultInput
																		{...field}
																		ref={ref}
																		error={invalid}
																		name={`insured_person.passport_number`}
																		helpertext={invalid ? error.message : null}
																		label="Passport Number"
																		type="text"
																		required
																	/>
																)}
															/>
														)}
													</div>
												</div>

												{/** Travel Information Area */}
												<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-10 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-b-2 tw-border-[#171e41] tw-pb-10">
													<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
														Travel Information
													</h4>
													<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
														{userDetails.isLoading ? (
															<Skeleton
																variant="text"
																sx={{ fontSize: '3rem', width: '100%' }}
															/>
														) : (
															<Controller
																name={`insured_person.arrival_date`}
																control={control}
																defaultValue={''}
																rules={{
																	required: 'Date is required.',
																}}
																render={({
																	field: { value, onChange, ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<FormControl error={invalid}>
																		<LocalizationProvider
																			dateAdapter={AdapterDateFns}>
																			<DatePicker
																				{...field}
																				ref={ref}
																				name={`insured_person.arrival_date`}
																				minDate={addDays(new Date(), 1)}
																				value={new Date(value)}
																				onChange={(value) => {
																					if (value !== null) {
																						onChange(
																							dayjs(value).format('YYYY-MM-DD')
																						);

																						if (
																							watch(
																								`insured_person.duration`
																							) !== ''
																						) {
																							setValue(
																								`insured_person.departure_date`,
																								dayjs(
																									addDays(
																										new Date(
																											watch(
																												`insured_person.arrival_date`
																											)
																										),
																										Number(
																											watch(
																												`insured_person.duration`
																											)
																										) - 1
																									)
																								).format('YYYY-MM-DD'),
																								{
																									shouldValidate: true,
																									shouldTouch: true,
																								}
																							);
																						}
																					} else {
																						onChange('');
																					}
																				}}
																				label="Arrival date in Ghana"
																				format="dd/MM/yyyy"
																			/>
																		</LocalizationProvider>
																		<FormHelperText>
																			{invalid ? error.message : null}
																		</FormHelperText>
																	</FormControl>
																)}
															/>
														)}

														{pricingPlans.isLoading ? (
															<Skeleton
																variant="text"
																sx={{ fontSize: '3rem', width: '100%' }}
															/>
														) : (
															<Controller
																name={`insured_person.duration`}
																control={control}
																defaultValue={''}
																rules={{
																	required: 'Duration is required.',
																}}
																render={({
																	field: { value, onChange, ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<SelectInput
																		{...field}
																		ref={ref}
																		name={`insured_person.duration`}
																		error={invalid}
																		helpertext={invalid ? error.message : null}
																		label="Duration"
																		onChange={(event) => {
																			onChange(event);
																			setValue(
																				`insured_person.departure_date`,
																				dayjs(
																					addDays(
																						new Date(
																							watch(
																								`insured_person.arrival_date`
																							)
																						),
																						event.target.value - 1
																					)
																				).format('YYYY-MM-DD'),
																				{
																					shouldValidate: true,
																					shouldTouch: true,
																				}
																			);
																		}}
																		options={DURATION_PRICING}
																		disabled={
																			watch(`insured_person.arrival_date`) ===
																			''
																				? true
																				: false
																		}
																		required
																	/>
																)}
															/>
														)}

														<div className="tw-block lg:tw-hidden tw-w-full">
															{userDetails.isLoading ? (
																<Skeleton
																	variant="text"
																	sx={{ fontSize: '3rem', width: '100%' }}
																/>
															) : (
																<Controller
																	name={`insured_person.departure_date`}
																	control={control}
																	defaultValue={''}
																	rules={{
																		required: 'Date is required.',
																	}}
																	render={({
																		field: { value, onChange, ref, ...field },
																		fieldState: { error, invalid },
																	}) => (
																		<FormControl
																			error={invalid}
																			sx={{ width: '100%' }}>
																			<LocalizationProvider
																				dateAdapter={AdapterDateFns}>
																				<DatePicker
																					{...field}
																					ref={ref}
																					name={`insured_person.departure_date`}
																					value={new Date(value)}
																					onChange={(value) => {
																						if (value !== null) {
																							onChange(
																								dayjs(value).format(
																									'YYYY-MM-DD'
																								)
																							);
																						} else {
																							onChange('');
																						}
																					}}
																					label="Departure date from Ghana"
																					format="dd/MM/yyyy"
																					disabled
																				/>
																			</LocalizationProvider>
																			<FormHelperText>
																				{invalid ? error.message : null}
																			</FormHelperText>
																		</FormControl>
																	)}
																/>
															)}
														</div>

														<div className="tw-col-span-1 lg:tw-col-span-2 tw-hidden">
															{userDetails.isLoading ? (
																<Skeleton
																	variant="text"
																	sx={{ fontSize: '3rem', width: '100%' }}
																/>
															) : (
																<Controller
																	name={`insured_person.address_ghana`}
																	control={control}
																	defaultValue={''}
																	rules={
																		{
																			//required: 'Please enter address',
																		}
																	}
																	render={({
																		field: { ref, ...field },
																		fieldState: { error, invalid },
																	}) => (
																		<DefaultInput
																			{...field}
																			ref={ref}
																			name={`insured_person.address_ghana`}
																			error={invalid}
																			helpertext={
																				invalid ? error.message : null
																			}
																			label="Address in Ghana"
																			type="text"
																			//required
																		/>
																	)}
																/>
															)}
														</div>
													</div>
												</div>

												{/** Contact Information Area */}
												<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-10 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-b-2 tw-border-[#171e41] tw-pb-10">
													<div className="tw-w-full tw-gap-3 tw-flex tw-flex-col tw-justify-start tw-items-start">
														<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
															Contact Information
														</h4>
														<span className="tw-bg-[#7862AF]/20 tw-w-full tw-h-fit tw-p-3 tw-rounded-lg">
															<p className="tw-w-full tw-text-left tw-text-xs md:tw-text-sm">
																Please provide your personal contact information
																as well as the information of your emergency
																contact in your home country. We also require a
																second emergency contact in Ghana.
															</p>
															<h6 className="tw-mt-3 tw-w-full tw-text-left tw-text-[#171e41] tw-font-semibold tw-text-xs md:tw-text-sm">
																Why do we need this information?
															</h6>
															<p className="tw-w-full tw-mt-1 tw-text-left tw-text-xs md:tw-text-sm">
																In case of any unfortunate event, the emergency
																contacts provided below will be contacted and
																assisted on your purchased insurance and claim
																process.
															</p>
															<h6 className="tw-mt-3 tw-w-full tw-text-left tw-text-[#171e41] tw-font-semibold tw-text-xs md:tw-text-sm">
																Note
															</h6>
															<p className="tw-w-full tw-mt-1 tw-text-left tw-text-xs md:tw-text-sm">
																Phone numbers must follow the international
																standard i.e (country code then number)
															</p>
														</span>
													</div>
													<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
														{userDetails.isLoading ? (
															<Skeleton
																variant="text"
																sx={{ fontSize: '3rem', width: '100%' }}
															/>
														) : (
															<Controller
																name={`insured_person.email`}
																control={control}
																defaultValue={''}
																rules={{
																	pattern: {
																		value:
																			/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/gi,
																		message:
																			'Please enter a valid email address',
																	},
																	required: 'Please enter email',
																}}
																render={({
																	field: { ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<DefaultInput
																		{...field}
																		ref={ref}
																		name={`insured_person.email`}
																		error={invalid}
																		helpertext={invalid ? error.message : null}
																		label="Email"
																		type="email"
																		required
																		disabled
																	/>
																)}
															/>
														)}

														{userDetails.isLoading ? (
															<Skeleton
																variant="text"
																sx={{ fontSize: '3rem', width: '100%' }}
															/>
														) : (
															<Controller
																name={`insured_person.telephone`}
																control={control}
																rules={{
																	pattern: {
																		value:
																			/\+?(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/gi,
																		message:
																			'Please enter a valid phone number. Phone number must follow the international standard',
																	},
																	required: 'Please enter telephone number',
																}}
																defaultValue={''}
																render={({
																	field: { ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<FormControl error={invalid} required>
																		<PhoneInput
																			{...field}
																			ref={ref}
																			name={`insured_person.telephone`}
																			specialLabel="Phone number"
																			placeholder="Phone number"
																			searchStyle={{
																				width: '90%',
																				height: '40px',
																			}}
																			error={invalid}
																			searchPlaceholder="Find country"
																			inputStyle={{
																				width: '100%',
																				height: '55px',
																				borderColor: invalid
																					? 'red'
																					: '#616B7D',
																			}}
																			//excludeCountries={['gh']}
																			country={
																				watch(`insured_person.country`)
																					? watch(
																							`insured_person.country`
																					  )?.toLowerCase()
																					: 'us'
																			}
																			countryCodeEditable={false}
																			enableSearch={true}
																		/>
																		<FormHelperText>
																			{invalid ? error.message : null}
																		</FormHelperText>
																	</FormControl>
																)}
															/>
														)}
													</div>

													{userDetails.isLoading ? (
														<Skeleton
															variant="text"
															sx={{ fontSize: '3rem', width: '100%' }}
														/>
													) : (
														<Controller
															name={`insured_person.address`}
															control={control}
															defaultValue={''}
															rules={{
																required: 'Please enter address',
															}}
															render={({
																field: { ref, ...field },
																fieldState: { error, invalid },
															}) => (
																<DefaultInput
																	{...field}
																	ref={ref}
																	name={`insured_person.address`}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="Address in Home Country"
																	type="text"
																	required
																/>
															)}
														/>
													)}

													<div className="tw-w-full h-fit tw-p-2 tw-gap-10 tw-hidden tw-flex-col tw-justify-start tw-items-start tw-rounded-md tw-shadow-sm">
														<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF] tw-hidden md:tw-block">
															Emergency Contact Information
														</h4>
														<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF] md:tw-hidden">
															Emergency Contact Info
														</h4>
														<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
															{userDetails.isLoading ? (
																<Skeleton
																	variant="text"
																	sx={{ fontSize: '3rem', width: '100%' }}
																/>
															) : (
																<Controller
																	name={`insured_person.emergency_contact_first_name`}
																	control={control}
																	defaultValue={''}
																	rules={
																		{
																			//required: 'Please enter first name',
																		}
																	}
																	render={({
																		field: { ref, ...field },
																		fieldState: { error, invalid },
																	}) => (
																		<DefaultInput
																			{...field}
																			ref={ref}
																			name={`insured_person.emergency_contact_first_name`}
																			error={invalid}
																			helpertext={
																				invalid ? error.message : null
																			}
																			label="Given/First Name(s)"
																			type="text"
																			//required
																		/>
																	)}
																/>
															)}
															{userDetails.isLoading ? (
																<Skeleton
																	variant="text"
																	sx={{ fontSize: '3rem', width: '100%' }}
																/>
															) : (
																<Controller
																	name={`insured_person.emergency_contact_last_name`}
																	control={control}
																	defaultValue={''}
																	rules={
																		{
																			//required: 'Please enter last name',
																		}
																	}
																	render={({
																		field: { ref, ...field },
																		fieldState: { error, invalid },
																	}) => (
																		<DefaultInput
																			{...field}
																			ref={ref}
																			name={`insured_person.emergency_contact_last_name`}
																			error={invalid}
																			helpertext={
																				invalid ? error.message : null
																			}
																			label="Surname/Last Name"
																			type="text"
																			//required
																		/>
																	)}
																/>
															)}
														</div>

														{userDetails.isLoading ? (
															<Skeleton
																variant="text"
																sx={{ fontSize: '3rem', width: '100%' }}
															/>
														) : (
															<Controller
																name={`insured_person.emergency_contact_address`}
																control={control}
																defaultValue={''}
																rules={
																	{
																		//required: 'Please enter address',
																	}
																}
																render={({
																	field: { ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<DefaultInput
																		{...field}
																		ref={ref}
																		name={`insured_person.emergency_contact_address`}
																		error={invalid}
																		helpertext={invalid ? error.message : null}
																		label="Address"
																		type="text"
																		//required
																	/>
																)}
															/>
														)}

														<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
															{userDetails.isLoading ? (
																<Skeleton
																	variant="text"
																	sx={{ fontSize: '3rem', width: '100%' }}
																/>
															) : (
																<Controller
																	control={control}
																	name={`insured_person.emergency_contact_country`}
																	defaultValue={watch('country')}
																	rules={
																		{
																			//required: 'Please select country',
																		}
																	}
																	render={({
																		field: { ref, ...field },
																		fieldState: { error, invalid },
																	}) => (
																		<SelectInput
																			{...field}
																			ref={ref}
																			name={`insured_person.emergency_contact_country`}
																			error={invalid}
																			helpertext={
																				invalid ? error.message : null
																			}
																			label="Country / Region"
																			options={countries}
																			//required
																		/>
																	)}
																/>
															)}

															{userDetails.isLoading ? (
																<Skeleton
																	variant="text"
																	sx={{ fontSize: '3rem', width: '100%' }}
																/>
															) : (
																<Controller
																	name={`insured_person.emergency_contact_telephone`}
																	control={control}
																	defaultValue={''}
																	rules={{
																		pattern: {
																			value:
																				/\+?(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/gi,
																			message:
																				'Please enter a valid phone number. Phone number must follow the international standard',
																		},
																		//required: 'Please enter phone number',
																	}}
																	render={({
																		field: { ref, ...field },
																		fieldState: { error, invalid },
																	}) => (
																		<FormControl error={invalid} required>
																			<PhoneInput
																				{...field}
																				ref={ref}
																				name={`insured_person.emergency_contact_telephone`}
																				specialLabel="Phone number"
																				placeholder="Phone number"
																				searchStyle={{
																					width: '90%',
																					height: '40px',
																				}}
																				error={invalid}
																				searchPlaceholder="Find country"
																				inputStyle={{
																					width: '100%',
																					height: '55px',
																					borderColor: invalid
																						? 'red'
																						: '#616B7D',
																				}}
																				//excludeCountries={['gh']}
																				country={
																					watch(
																						`insured_person.emergency_contact_country`
																					)
																						? watch(
																								`insured_person.emergency_contact_country`
																						  )?.toLowerCase()
																						: 'us'
																				}
																				countryCodeEditable={false}
																				enableSearch={true}
																			/>
																			<FormHelperText>
																				{invalid ? error.message : null}
																			</FormHelperText>
																		</FormControl>
																	)}
																/>
															)}
														</div>
													</div>

													<div className="tw-w-full h-fit tw-p-2 tw-gap-10 tw-hidden tw-flex-col tw-justify-start tw-items-start tw-rounded-md tw-shadow-sm">
														<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
															Emergency Contact in Ghana
														</h4>
														<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
															{userDetails.isLoading ? (
																<Skeleton
																	variant="text"
																	sx={{ fontSize: '3rem', width: '100%' }}
																/>
															) : (
																<Controller
																	name={`insured_person.emergency_contact_ghana_first_name`}
																	control={control}
																	defaultValue={''}
																	rules={
																		{
																			//required: 'Please enter first name',
																		}
																	}
																	render={({
																		field: { ref, ...field },
																		fieldState: { error, invalid },
																	}) => (
																		<DefaultInput
																			{...field}
																			ref={ref}
																			name={`insured_person.emergency_contact_ghana_first_name`}
																			error={invalid}
																			helpertext={
																				invalid ? error.message : null
																			}
																			label="Given/First Name(s)"
																			type="text"
																			//required
																		/>
																	)}
																/>
															)}

															{userDetails.isLoading ? (
																<Skeleton
																	variant="text"
																	sx={{ fontSize: '3rem', width: '100%' }}
																/>
															) : (
																<Controller
																	name={`insured_person.emergency_contact_ghana_last_name`}
																	control={control}
																	defaultValue={''}
																	rules={
																		{
																			//required: 'Please enter last name',
																		}
																	}
																	render={({
																		field: { ref, ...field },
																		fieldState: { error, invalid },
																	}) => (
																		<DefaultInput
																			{...field}
																			ref={ref}
																			name={`insured_person.emergency_contact_ghana_last_name`}
																			error={invalid}
																			helpertext={
																				invalid ? error.message : null
																			}
																			label="Surname/Last Name"
																			type="text"
																			//required
																		/>
																	)}
																/>
															)}
														</div>

														<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
															{userDetails.isLoading ? (
																<Skeleton
																	variant="text"
																	sx={{ fontSize: '3rem', width: '100%' }}
																/>
															) : (
																<Controller
																	name={`insured_person.emergency_contact_ghana_telephone`}
																	control={control}
																	defaultValue={''}
																	rules={{
																		pattern: {
																			value:
																				/\+?(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/gi,
																			message:
																				'Please enter a valid phone number. Phone number must follow the international standard',
																		},
																		//required: 'Please enter phone number',
																	}}
																	render={({
																		field: { ref, ...field },
																		fieldState: { error, invalid },
																	}) => (
																		<FormControl
																			error={invalid}
																			sx={{ width: '100%' }}
																			required>
																			<PhoneInput
																				{...field}
																				ref={ref}
																				name={`insured_person.emergency_contact_ghana_telephone`}
																				specialLabel="Phone number"
																				placeholder="Phone number"
																				error={invalid}
																				//searchPlaceholder="Find country"
																				inputStyle={{
																					width: '100%',
																					height: '55px',
																					borderColor: invalid
																						? 'red'
																						: '#616B7D',
																				}}
																				onlyCountries={['gh']}
																				country={'gh'}
																				countryCodeEditable={false}
																				enableSearch={false}
																			/>
																			<FormHelperText>
																				{invalid ? error.message : null}
																			</FormHelperText>
																		</FormControl>
																	)}
																/>
															)}
														</div>
													</div>
												</div>

												{/** Dependant Information Area */}
												<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-10 tw-flex tw-flex-col tw-justify-start tw-items-start">
													<div className="tw-w-full tw-gap-3 tw-flex tw-flex-col tw-justify-start tw-items-start">
														<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
															{/* Health Information */} Dependants Information
														</h4>
														<span className="tw-bg-[#7862AF]/20 tw-w-full tw-h-fit tw-p-3 tw-rounded-lg">
															<p className="tw-w-full tw-text-left tw-text-xs md:tw-text-sm">
																Travelling with your family? You can add on your
																spouse and children here
															</p>
														</span>
													</div>

													<DependantArray
														//nestIndex={0}
														existingDependants={USER_DETAILS?.dependants}
														{...{
															control,
															watch,
															setValue,
														}}
													/>
												</div>
											</div>
										</div>
									</section>
								</>
							)}

							{/* Summary area showing the summary of information provided as well as the total amount payable */}
							{formStep === 2 && (
								<section className="tw-w-full tw-flex tw-flex-col tw-gap-10">
									<div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-1 tw-bg-white tw-border tw-border-b-black tw-rounded-lg tw-py-3 tw-px-8 tw-shadow-md">
										<div className="tw-w-full tw-px-4 tw-rounded-lg tw-mb-2">
											<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
												<div className="tw-flex tw-flex-col md:tw-flex-row tw-mb-5 tw-justify-start tw-items-start md:tw-items-center tw-gap-3 md:tw-gap-5">
													<h3 className="tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
														Traveller
													</h3>

													<Typography sx={{ color: 'text.secondary' }}>
														{watch(`insured_person`)?.first_name}{' '}
														{watch(`insured_person`)?.last_name}
													</Typography>
												</div>

												<div
													onClick={goToPrevious}
													className="tw-cursor-pointer tw-group tw-text-[#7862AF] tw-font-semibold tw-text-sm tw-flex tw-gap-2 tw-items-center">
													<span className="tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-6 tw-w-6 tw-text-[#7862AF] group-hover:tw-text-white tw-bg-transparent group-hover:tw-shadow-lg group-hover:tw-shadow-[#7862AF]/50 group-hover:tw-bg-[#7862AF]">
														<MdEdit className="tw-text-base" />
													</span>
													Edit
												</div>
											</div>

											{/** Personal Information Area */}

											<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-3 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
												<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium tw-text-xl tw-text-[#171e41]">
													Personal Information
												</h4>
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-5 tw-rounded-md tw-p-3">
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															Given/First name(s)
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{watch(`insured_person`)['first_name']}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															Surname/Last name
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{watch(`insured_person`)['last_name']}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															gender
														</p>
														<p className="tw-capitalize tw-font-medium tw-text-base tw-text-[#171e41]">
															{watch(`insured_person`)['gender']}
														</p>
													</div>

													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															passport number
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{watch(`insured_person`)['passport_number']}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															date of birth
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{dayjs(watch(`insured_person`)['dob']).format(
																'MMM DD, YYYY'
															)}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															email
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{watch(`insured_person`)['email']}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															telephone
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															+{watch(`insured_person`)['telephone']}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															address
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{watch(`insured_person`)['address']}
														</p>
													</div>
												</div>
											</div>

											{/** Travel Information Area */}

											<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-3 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
												<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium tw-text-xl tw-text-[#171e41]">
													Travel Information
												</h4>
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-5 tw-rounded-md tw-p-3">
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															country / region
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{
																countries.filter(
																	({ value }) =>
																		value === watch(`insured_person`)['country']
																)[0]?.name
															}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															arrival date
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{dayjs(
																watch(`insured_person`)['arrival_date']
															).format('MMM DD, YYYY')}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															departure date
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{dayjs(
																watch(`insured_person`)['departure_date']
															).format('MMM DD, YYYY')}
														</p>
													</div>
													<div className="tw-hidden">
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															address in ghana
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{watch(`insured_person`)['address_ghana']}
														</p>
													</div>
												</div>
											</div>

											{/** Emergency Contact Information Area */}

											<div className="tw-w-full tw-hidden tw-h-fit tw-p-2 tw-gap-3 tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
												<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium tw-text-xl tw-text-[#171e41]">
													Emergency Contact Information
												</h4>
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-5 tw-rounded-md tw-p-3">
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															given/first name
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{
																watch(`insured_person`)[
																	'emergency_contact_first_name'
																]
															}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															surname/last name
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{
																watch(`insured_person`)[
																	'emergency_contact_last_name'
																]
															}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															address
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{
																watch(`insured_person`)[
																	'emergency_contact_address'
																]
															}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															phone number
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															+
															{
																watch(`insured_person`)[
																	'emergency_contact_telephone'
																]
															}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															country
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{
																countries.filter(
																	({ value }) =>
																		value ===
																		watch(`insured_person`)[
																			'emergency_contact_country'
																		]
																)[0]?.name
															}
														</p>
													</div>
												</div>
											</div>

											{/** Emergency Contact in Ghana Information Area */}

											<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-3 tw-hidden tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
												<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium tw-text-xl tw-text-[#171e41]">
													Emergency Contact in Ghana Information
												</h4>
												<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-5 tw-rounded-md tw-p-3">
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															given/first name
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{
																watch(`insured_person`)[
																	'emergency_contact_ghana_first_name'
																]
															}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															surname/last name
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															{
																watch(`insured_person`)[
																	'emergency_contact_ghana_last_name'
																]
															}
														</p>
													</div>
													<div>
														<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
															phone number
														</p>
														<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
															+
															{
																watch(`insured_person`)[
																	'emergency_contact_ghana_telephone'
																]
															}
														</p>
													</div>
												</div>
											</div>

											{/** Dependant Information Area */}

											{watch(`insured_person`)?.dependants?.length > 0 ? (
												<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-3 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
													<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium tw-text-xl tw-text-[#171e41]">
														Dependants Information
													</h4>
													{watch(`insured_person`)?.dependants?.map(
														(dependant, index) => (
															<div
																key={index}
																className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-5 tw-rounded-md tw-p-3 tw-border-b">
																<div>
																	<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																		Given/First name
																	</p>
																	<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																		{dependant['first_name']}
																	</p>
																</div>
																<div>
																	<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																		Surname/Last name
																	</p>
																	<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																		{dependant['last_name']}
																	</p>
																</div>
																<div>
																	<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																		Email
																	</p>
																	<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																		{dependant['email']}
																	</p>
																</div>
																<div>
																	<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																		Phone number
																	</p>
																	<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																		+{dependant['telephone']}
																	</p>
																</div>
																<div>
																	<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																		Date of Birth
																	</p>
																	<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																		{dayjs(dependant['dob']).format(
																			'MMM DD, YYYY'
																		)}
																	</p>
																</div>
																<div>
																	<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																		Gender
																	</p>
																	<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																		{dependant['gender']}
																	</p>
																</div>
																<div>
																	<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																		Passport number
																	</p>
																	<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																		{dependant['passport_number']}
																	</p>
																</div>
																<div>
																	<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																		Relationship type
																	</p>
																	<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																		{dependant['relationship_type']}
																	</p>
																</div>
															</div>
														)
													)}
												</div>
											) : null}

											<div className="tw-w-full tw-flex tw-justify-end">
												<div
													onClick={goToPrevious}
													className="tw-cursor-pointer tw-group tw-text-[#7862AF] tw-font-semibold tw-text-sm tw-flex tw-gap-2 tw-items-center">
													<span className="tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-6 tw-w-6 tw-text-[#7862AF] group-hover:tw-text-white tw-bg-transparent group-hover:tw-shadow-lg group-hover:tw-shadow-[#7862AF]/50 group-hover:tw-bg-[#7862AF]">
														<MdEdit className="tw-text-base" />
													</span>
													Edit
												</div>
											</div>
										</div>
									</div>

									<div className="tw-w-full tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-5 tw-py-3">
										<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#7862AF] tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
											Summary
										</h4>

										<div className="tw-w-full tw-flex tw-items-center tw-justify-between tw-gap-5 ">
											<div className="tw-flex tw-justify-start tw-items-center tw-gap-2">
												<span className="tw-capitalize tw-w-24 tw-font-normal tw-text-sm tw-text-gray-700 tw-pr-2 tw-border-r-2 tw-border-[#7862AF]">
													Traveller {pricing?.traveller_no}
												</span>

												<p className="tw-text-base">
													{Intl.NumberFormat('en-US', {
														style: 'currency',
														currency: 'USD',
													}).format(pricing?.price)}{' '}
													x {pricing?.no_of_travellers}
												</p>
											</div>

											<div className="tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-1">
												<span className="tw-relative tw-flex tw-justify-center tw-items-end tw-gap-1">
													<p className="tw-text-base">
														{Intl.NumberFormat('en-US', {
															style: 'currency',
															currency: 'USD',
														}).format(
															pricing?.price * pricing?.no_of_travellers
														)}
													</p>
												</span>
											</div>
										</div>

										<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-5 tw-pt-2 tw-border-t-2 tw-border-[#171e41]">
											<span className="tw-capitalize tw-font-normal tw-text-lg tw-text-[#171e41]">
												Sub Total
											</span>

											<h2 className="tw-font-medium tw-text-xl tw-text-[#7862AF] tw-flex tw-justify-center tw-items-end tw-gap-1">
												{Intl.NumberFormat('en-US', {
													style: 'currency',
													currency: 'USD',
												}).format(pricing?.price * pricing?.no_of_travellers)}
											</h2>
										</div>
									</div>

									<div className="block ">
										<Controller
											control={control}
											name={'terms_and_conditions'}
											defaultValue={false}
											rules={{
												required: 'Please accept terms and conditions',
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
																name={'terms_and_conditions'}
																checked={watch(`terms_and_conditions`)}
															/>
														}
														label={'I accept the terms and conditions'}
													/>
													<FormHelperText error>
														{invalid ? error.message : null}
													</FormHelperText>
												</>
											)}
										/>
									</div>
								</section>
							)}

							<div className="tw-w-full tw-flex tw-justify-end tw-items-end tw-mt-4">
								<div className="tw-w-full lg:w-1/2 tw-flex tw-justify-end tw-items-end">
									{renderButton()}
								</div>
							</div>
						</form>
					</div>

					{/* Plan benefits list */}
					{showMore && (
						<div className="tw-block">
							<Accordion questionsAnswers={planTabsData} />
						</div>
					)}

					{/* Button to show or hide plan benefits list */}
					<div
						onClick={handleShowDetails}
						className="tw-font-bold tw-text-sm tw-bg-white tw-py-3 tw-px-6 tw-rounded-xl tw-shadow-sm tw-cursor-pointer tw-w-fit tw-flex tw-justify-start tw-items-center tw-gap-2 tw-mt-6 tw-transition-all tw-duration-500 tw-ease-in-out hover:tw-text-white tw-text-[#8e6abf] hover:tw-bg-[#8e6abf] hover:tw-shadow-lg hover:tw-shadow-[#8e6abf]/50">
						{!showMore ? 'Show Plan Details' : 'Hide Plan Details'}
					</div>
				</div>
			</div>

			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={makePayment.isLoading}>
				<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
					<CircularProgress color="inherit" />
					<p className="tw-text-white tw-font-medium tw-text-center tw-text-lg tw-w-2/3">
						Please wait to be redirected
					</p>
				</div>
			</Backdrop>
		</div>
	);
};

export default PurchasePolicy;
