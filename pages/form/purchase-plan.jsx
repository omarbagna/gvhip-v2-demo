'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import logo from '@/public/images/gsti_logo.jpeg';
import DefaultInput from '@/components/Input/DefaultInput';
import SelectInput from '@/components/Input/SelectInput';
import { addDays } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { countries } from '../../data/countriesData';
import {
	Accordion as MuiAccordion,
	AccordionDetails,
	AccordionSummary,
	Backdrop,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Typography,
	Skeleton,
} from '@mui/material';
import Accordion from '@/components/Accordion';
import { useMutation, useQuery } from 'react-query';
import { MdDelete, MdEdit, MdOutlineExpandMore } from 'react-icons/md';
import { IoAdd } from 'react-icons/io5';
import { planTabsData } from 'data/plansData';
// import baseUrl from '@/utils/baseUrl';
import axios from 'axios';
import dayjs from 'dayjs';
import DependantArray from '@/components/Form/dependantArray';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { toast } from 'react-toastify';
import BlurImage from '@/components/BlurImage/BlurImage';

const MAX_STEPS = 2;

const Form = () => {
	const [formStep, setFormStep] = useState(1);
	const [basicData, setBasicData] = useState(null);
	const [open, setOpen] = useState(1);
	const [showMore, setShowMore] = useState(false);
	const [saveData, setSaveData] = useState(false);
	const [prices, setPrices] = useState([]);

	const router = useRouter();

	const temporalQuery = router.query;

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

	// Fetch the temporal data of the user only if the url contains a UID
	const getTemporalData = async () => {
		const url = `/api/get-temporal-data`;
		const payload = { uid: temporalQuery?.uid };

		const response = await axios.post(url, payload);

		return response;
	};

	const temporalData = useQuery('temporal-data', getTemporalData, {
		enabled:
			temporalQuery?.uid && formStep === 1 && PRICING !== null ? true : false,
	});

	const handleShowDetails = () => {
		setShowMore((prev) => !prev);
	};

	// Check if some data exists in local storage and update the basicData state with the data found
	useEffect(() => {
		const data = window.sessionStorage.getItem('basicData');
		if (data !== null) setBasicData(JSON.parse(data));
	}, []);

	let subTotal = 0;

	const {
		watch,
		control,
		setValue,
		reset,
		trigger,
		formState: {
			isValid,
			//, errors
		},
		handleSubmit,
	} = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			start_date: '',
			end_date: '',
			country: '',
			insured_person: [
				{
					dependants: [],
				},
			],

			//: 'other',
		},
	});

	console.log(watch());

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'insured_person',
	});

	// Function to calculate the amount payable for a traveller and the discount to be applied
	const calculatePrices = () => {
		let userPrices = [];
		let travelDurationPerTraveller = null;

		/* 
		Map over the travellers provided and calculate the the total number of people(dependants) 
		travelling with a single traveller, the duration of coverage, the discount to be applied and
		the amount to be paid per individual
		 */
		watch('insured_person').map((traveller, index) => {
			travelDurationPerTraveller = PRICING?.filter(
				(price) =>
					price?.duration === watch(`insured_person[${index}].duration`)
			);

			return userPrices.push({
				traveller_no: index + 1,
				no_of_travellers: traveller.dependants?.length + 1,
				discount: travelDurationPerTraveller[0]?.discount,
				price: travelDurationPerTraveller[0]?.price_after_discount,
			});
		});

		// Save the pricing information to the prices state
		setPrices(userPrices);
	};

	// Save temporal data Request
	const saveTemporalDataRequest = async (data) => {
		const url = `/api/save-temporal-data`;
		const { data: response } = await axios.post(url, data);
		return response;
	};

	const saveTemporalData = useMutation(
		(temporalData) => saveTemporalDataRequest(temporalData),
		{
			onSuccess: (data) => {
				//console.log('Success response ', data);
				if (data?.status === 200) {
					router.query.uid = data?.unique_id;
					router.push(router);
					setSaveData(false);
					setFormStep((prev) => prev + 1);
				}
				setSaveData(false);
			},
			onError: (error) => {
				toast.error(error?.message);
				setSaveData(false);
			},
		}
	);

	// Function to run when next button is clicked
	const goToNext = () => {
		trigger();
		if (isValid) {
			calculatePrices();
			setSaveData(true);
		} else {
			toast.error('Please fill all required fields');
		}
	};

	// Function to run when back button is clicked
	const goToPrevious = () => {
		setFormStep((prev) => prev - 1);
	};

	// Check if some temporal data is available and populate the input fields with that data
	useEffect(() => {
		if (temporalData?.data?.data?.data) {
			reset({
				insured_person: temporalData?.data?.data?.data?.insured_person,
			});
		} else if (basicData) {
			reset({
				start_date: basicData?.start_date,
				end_date: basicData?.end_date,
				country: basicData?.country,
				insured_person: basicData?.insured_person,
			});
		}
	}, [reset, temporalData?.data?.data?.data, basicData]);

	// Trigger to save temporal data
	useEffect(() => {
		let totalPayable = 0;
		if (saveData) {
			let insuredData = [];

			// Calculate the total amount to be paid from the prices generated and saved for each traveller
			prices.map((traveller, index) => {
				totalPayable += traveller?.price * traveller?.no_of_travellers;
				return;
			});

			/* Map over the information the user has provided and populate the insured data array 
			with the user provided information as well as the pricing information per user */
			watch('insured_person')?.map((person, index) => {
				return insuredData.push({
					...person,
					dependants:
						person.dependants?.length > 0
							? person.dependants?.map((dependant) => ({
									...dependant,
									country: person?.country,
							  }))
							: [],

					arrival_date: dayjs(person?.arrival_date).format('YYYY-MM-DD'),
					departure_date: dayjs(person?.departure_date).format('YYYY-MM-DD'),
					name: `${person?.first_name} ${person?.last_name}`,
					price: prices[index]?.price,
					discount: prices[index]?.discount,
				});
			});

			// Combine all the necessary information to be sent to the backend
			const temporalData = {
				insured_person: insuredData,
				total_price: totalPayable,
				uid: temporalQuery?.uid ? temporalQuery?.uid : null,
			};

			// Submit the save temporal data request
			saveTemporalData.mutate(temporalData);
			setSaveData(false);
		}
	}, [saveData]);

	// Form buttons renderer
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
					<button
						className="btn-style-one dark-green-color"
						//disabled={!isValid}
						//onClick={goToNext}
						type="submit">
						Proceed to Payment <i className="bx bx-chevron-right"></i>
					</button>
				</div>
			);
		} else if (formStep === 1) {
			return (
				<div className="tw-w-full tw-flex tw-justify-end tw-items-center">
					<button
						className="btn-style-one dark-green-color"
						//disabled={!isValid}
						onClick={() => {
							goToNext();
						}}
						type="button">
						Next <i className="bx bx-chevron-right"></i>
					</button>
				</div>
			);
		} else {
			return (
				<div className="tw-w-full tw-flex tw-justify-center tw-items-center tw-tw-gap-5 tw-tw-mt-8">
					<span
						className="btn-style-back crimson-color tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-rotate-180 tw-shadow-md tw-justify-center tw-items-center tw-text-3xl"
						onClick={goToPrevious}>
						<i className="bx bx-chevron-right"></i>
					</span>
					<button
						className="btn-style-one dark-green-color"
						//disabled={!isValid}
						//onClick={goToNext}
						type="submit">
						Next <i className="bx bx-chevron-right"></i>
					</button>
				</div>
			);
		}
	};

	// Control accordion open and close
	const handleOpen = (value) => {
		setOpen(open === value ? 0 : value);
	};

	// Send payment request
	const paymentRequest = async (data) => {
		const url = `/api/make-payment`;

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

					window.sessionStorage.clear();

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
				toast.error(error?.message);
				//toast.error(error?.response);

				if (error?.response?.data?.errors) {
					Object.values(error?.response?.data?.errors).map((value) => {
						return toast.error(value[0]);
					});
				}
			},
		}
	);

	const submitForm = (data) => {
		window.sessionStorage.clear();

		const paymentData = {
			uid: temporalQuery?.uid,
		};

		makePayment.mutate(paymentData);
	};

	return (
		<>
			<div className="tw-sticky tw-top-0 tw-z-30 tw-w-full tw-h-fit tw-flex tw-flex-col tw-justify-start tw-items-center tw-gap-3 tw-bg-white tw-px-6 tw-py-3 md:tw-py-5 md:tw-px-10 lg:tw-px-20">
				<div className="tw-w-full tw-flex tw-justify-start tw-gap-10 tw-items-center">
					<Link href="/">
						<a className="navbar-brand">
							<BlurImage
								height={50}
								width={60}
								src={logo}
								alt="site logo"
								className="rounded-2"
							/>
						</a>
					</Link>

					<h2 className="tw-hidden md:tw-flex tw-capitalize tw-font-title tw-font-bold tw-text-3xl lg:tw-text-4xl tw-text-[#171e41]  tw-justify-center tw-items-end tw-gap-1">
						Purchase your Plan
					</h2>

					<p className="tw-text-sm tw-shrink-0 tw-my-auto tw-block md:tw-hidden">
						Step {formStep}/{MAX_STEPS}
					</p>
				</div>

				<div className="tw-w-full tw-hidden md:tw-flex tw-justify-start tw-items-center tw-gap-3">
					<p className="tw-text-sm tw-pr-2 tw-border-r-2 tw-shrink-0 tw-my-auto">
						Step {formStep} of {MAX_STEPS}
					</p>

					<div className="tw-w-full tw-h-2 tw-bg-slate-300 tw-rounded-full">
						<div
							className="tw-transition-all tw-duration-500 tw-ease-in-out tw-bg-[#8e6abf] tw-h-full tw-rounded-full"
							style={{ width: `${formStep * 50}%` }}
						/>
					</div>
				</div>
			</div>

			<div className="tw-w-full tw-min-h-screen tw-h-full tw-flex tw-justify-center tw-items-start lg:tw-justify-between tw-bg-[#FEFBFB]">
				<div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-justify-start tw-items-center tw-my-10 md:tw-my-20">
					<div className="tw-w-full md:tw-w-5/6 tw-rounded-xl tw-mx-auto">
						<div className="tw-w-full tw-h-fit tw-px-8">
							<div className="tw-w-full tw-flex tw-flex-wrap-reverse tw-gap-3 tw-justify-between tw-items-center">
								<span className="">
									<span className="tw-w-fit tw-flex tw-justify-start tw-items-end tw-gap-1">
										<h2 className="tw-font-title tw-font-medium tw-text-3xl md:tw-text-5xl tw-text-[#171e41] tw-flex tw-justify-center tw-items-end tw-gap-1">
											{formStep === 1
												? 'Traveller Details'
												: 'Review and Accept Terms'}
										</h2>
									</span>
								</span>
							</div>
						</div>
						<div className="tw-px-4 tw-py-5 md:tw-px-8 md:tw-py-10">
							<form onSubmit={handleSubmit(submitForm)}>
								{/* Purchase form inputs */}
								{formStep === 1 && (
									<>
										<section className="tw-flex tw-flex-col tw-gap-8">
											<div className="tw-flex tw-flex-col tw-gap-3">
												{fields.map((inputField, index) => (
													<MuiAccordion
														id={`insured person ${index}`}
														expanded={open === index + 1}
														key={index}
														className="tw-w-full tw-border tw-border-blue-gray-100 tw-px-4 tw-rounded-lg tw-mb-2">
														<AccordionSummary
															expandIcon={
																<MdOutlineExpandMore className="tw-text-3xl" />
															}
															onClick={() => {
																handleOpen(index + 1);
																window.scrollTo({ top: 0, behavior: 'smooth' });
															}}>
															<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-pr-4">
																<div className="tw-grid tw-grid-cols-2 md:tw-flex tw-justify-start tw-items-start md:tw-items-center tw-gap-3 md:tw-gap-5">
																	<h3 className="tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#171e41]">
																		Traveller {index + 1}
																	</h3>

																	<span className="tw-bg-[#7862AF]/20 tw-w-fit tw-h-fit tw-px-3 tw-py-1 tw-rounded-lg">
																		<Typography sx={{ color: '#7862AF' }}>
																			Primary
																		</Typography>
																	</span>

																	<Typography
																		className="tw-col-span-2"
																		sx={{ color: 'text.secondary' }}>
																		{watch(
																			`insured_person[${index}].first_name`
																		)}{' '}
																		{watch(
																			`insured_person[${index}].last_name`
																		)}
																	</Typography>
																</div>

																{watch('insured_person')?.length > 1 ? (
																	<div
																		onClick={() => remove(index)}
																		className="tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-6 tw-w-6 tw-text-red-500 hover:tw-text-white tw-bg-transparent hover:tw-shadow-lg hover:tw-shadow-red-400/50 hover:tw-bg-red-500 cursor-pointer">
																		<MdDelete className="tw-text-base" />
																	</div>
																) : null}
															</div>
														</AccordionSummary>
														<AccordionDetails //className="tw-text-base tw-font-normal pt-0"
														>
															<div
																key={inputField.id}
																className="tw-relative tw-w-full tw-h-full tw-flex tw-flex-col tw-gap-5 tw-justify-center tw-items-center ">
																{/** Personal Information Area */}
																<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-10 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-y-2 tw-border-[#171e41] tw-py-10">
																	<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
																		Personal Information
																	</h4>
																	<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
																		<Controller
																			name={`insured_person[${index}].first_name`}
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
																					name={`insured_person[${index}].first_name`}
																					helpertext={
																						invalid ? error.message : null
																					}
																					label="First Name"
																					type="text"
																					required
																				/>
																			)}
																		/>
																		<Controller
																			name={`insured_person[${index}].last_name`}
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
																					name={`insured_person[${index}].last_name`}
																					error={invalid}
																					helpertext={
																						invalid ? error.message : null
																					}
																					label="Last Name"
																					type="text"
																					required
																				/>
																			)}
																		/>
																	</div>

																	<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
																		<Controller
																			name={`insured_person[${index}].dob`}
																			control={control}
																			defaultValue={''}
																			rules={{
																				required:
																					'Please specify date of birth',
																				valueAsDate: true,
																			}}
																			render={({
																				field: {
																					value,
																					onChange,
																					ref,
																					...field
																				},
																				fieldState: { error, invalid },
																			}) => (
																				<FormControl error={invalid}>
																					<LocalizationProvider
																						dateAdapter={AdapterDateFns}>
																						<DatePicker
																							{...field}
																							ref={ref}
																							name={`insured_person[${index}].dob`}
																							maxDate={new Date()}
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
																							label="Date of Birth"
																							format="dd/MM/yyyy"
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

																		<Controller
																			name={`insured_person[${index}].gender`}
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
																					name={`insured_person[${index}].gender`}
																					error={invalid}
																					helpertext={
																						invalid ? error.message : null
																					}
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
																				/>
																			)}
																		/>
																	</div>

																	<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
																		<Controller
																			control={control}
																			name={`insured_person[${index}].country`}
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
																					name={`insured_person[${index}].country`}
																					error={invalid}
																					helpertext={
																						invalid ? error.message : null
																					}
																					label="Country / Region"
																					options={countries}
																					required
																				/>
																			)}
																		/>

																		<Controller
																			name={`insured_person[${index}].passport_number`}
																			control={control}
																			defaultValue={''}
																			rules={{
																				required:
																					'Please enter passport number',
																			}}
																			render={({
																				field: { ref, ...field },
																				fieldState: { error, invalid },
																			}) => (
																				<DefaultInput
																					{...field}
																					ref={ref}
																					error={invalid}
																					name={`insured_person[${index}].passport_number`}
																					helpertext={
																						invalid ? error.message : null
																					}
																					label="Passport Number"
																					type="text"
																					required
																				/>
																			)}
																		/>
																	</div>
																</div>

																{/** Travel Information Area */}
																<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-10 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-b-2 tw-border-[#171e41] tw-pb-10">
																	<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
																		Travel Information
																	</h4>
																	<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
																		<Controller
																			name={`insured_person[${index}].arrival_date`}
																			control={control}
																			defaultValue={''}
																			rules={{
																				required: 'Date is required.',
																			}}
																			render={({
																				field: {
																					value,
																					onChange,
																					ref,
																					...field
																				},
																				fieldState: { error, invalid },
																			}) => (
																				<FormControl error={invalid}>
																					<LocalizationProvider
																						dateAdapter={AdapterDateFns}>
																						<DatePicker
																							{...field}
																							ref={ref}
																							name={`insured_person[${index}].arrival_date`}
																							minDate={addDays(new Date(), 1)}
																							value={new Date(value)}
																							onChange={(value) => {
																								if (value !== null) {
																									onChange(
																										dayjs(value).format(
																											'YYYY-MM-DD'
																										)
																									);

																									if (
																										watch(
																											`insured_person[${index}].duration`
																										) !== ''
																									) {
																										setValue(
																											`insured_person[${index}].departure_date`,
																											dayjs(
																												addDays(
																													new Date(
																														watch(
																															`insured_person[${index}].arrival_date`
																														)
																													),
																													Number(
																														watch(
																															`insured_person[${index}].duration`
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

																		{pricingPlans.isLoading ? (
																			<Skeleton
																				variant="text"
																				sx={{ fontSize: '3rem', width: '100%' }}
																			/>
																		) : (
																			<Controller
																				name={`insured_person[${index}].duration`}
																				control={control}
																				defaultValue={''}
																				rules={{
																					required: 'Duration is required.',
																				}}
																				render={({
																					field: {
																						value,
																						onChange,
																						ref,
																						...field
																					},
																					fieldState: { error, invalid },
																				}) => (
																					<SelectInput
																						{...field}
																						ref={ref}
																						name={`insured_person[${index}].duration`}
																						error={invalid}
																						helpertext={
																							invalid ? error.message : null
																						}
																						label="Duration"
																						onChange={(event) => {
																							onChange(event);
																							setValue(
																								`insured_person[${index}].departure_date`,
																								dayjs(
																									addDays(
																										new Date(
																											watch(
																												`insured_person[${index}].arrival_date`
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
																							watch(
																								`insured_person[${index}].arrival_date`
																							) === ''
																								? true
																								: false
																						}
																						required
																					/>
																				)}
																			/>
																		)}

																		<div className="tw-block lg:tw-hidden tw-w-full">
																			<Controller
																				name={`insured_person[${index}].departure_date`}
																				control={control}
																				defaultValue={''}
																				rules={{
																					required: 'Date is required.',
																				}}
																				render={({
																					field: {
																						value,
																						onChange,
																						ref,
																						...field
																					},
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
																								name={`insured_person[${index}].departure_date`}
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
																		</div>

																		<div className="tw-col-span-1 lg:tw-col-span-2 tw-hidden">
																			<Controller
																				name={`insured_person[${index}].address_ghana`}
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
																						name={`insured_person[${index}].address_ghana`}
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
																				Please provide your personal contact
																				information as well as the information
																				of your emergency contact in your home
																				country. We also require a second
																				emergency contact in Ghana.
																			</p>
																			<h6 className="tw-mt-3 tw-w-full tw-text-left tw-text-[#171e41] tw-font-semibold tw-text-xs md:tw-text-sm">
																				Why do we need this information?
																			</h6>
																			<p className="tw-w-full tw-mt-1 tw-text-left tw-text-xs md:tw-text-sm">
																				In case of any unfortunate event, the
																				emergency contacts provided below will
																				be contacted and assisted on your
																				purchased insurance and claim process.
																			</p>
																			<h6 className="tw-mt-3 tw-w-full tw-text-left tw-text-[#171e41] tw-font-semibold tw-text-xs md:tw-text-sm">
																				Note
																			</h6>
																			<p className="tw-w-full tw-mt-1 tw-text-left tw-text-xs md:tw-text-sm">
																				Phone numbers must follow the
																				international standard i.e (country code
																				then number)
																			</p>
																		</span>
																	</div>
																	<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
																		<Controller
																			name={`insured_person[${index}].email`}
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
																					name={`insured_person[${index}].email`}
																					error={invalid}
																					helpertext={
																						invalid ? error.message : null
																					}
																					label="Email"
																					type="email"
																					required
																				/>
																			)}
																		/>
																		<Controller
																			name={`insured_person[${index}].telephone`}
																			control={control}
																			rules={{
																				pattern: {
																					value:
																						/\+?(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/gi,
																					message:
																						'Please enter a valid phone number. Phone number must follow the international standard',
																				},
																				required:
																					'Please enter telephone number',
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
																						name={`insured_person[${index}].telephone`}
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
																								`insured_person[${index}].country`
																							)
																								? watch(
																										`insured_person[${index}].country`
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
																	</div>

																	<Controller
																		name={`insured_person[${index}].address`}
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
																				name={`insured_person[${index}].address`}
																				error={invalid}
																				helpertext={
																					invalid ? error.message : null
																				}
																				label="Address in Home Country"
																				type="text"
																				required
																			/>
																		)}
																	/>

																	<div className="tw-w-full h-fit tw-p-2 tw-gap-10 tw-hidden tw-flex-col tw-justify-start tw-items-start tw-rounded-md tw-shadow-sm">
																		<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF] tw-hidden md:tw-block">
																			Emergency Contact Information
																		</h4>
																		<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF] md:tw-hidden">
																			Emergency Contact Info
																		</h4>
																		<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
																			<Controller
																				name={`insured_person[${index}].emergency_contact_first_name`}
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
																						name={`insured_person[${index}].emergency_contact_first_name`}
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
																			<Controller
																				name={`insured_person[${index}].emergency_contact_last_name`}
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
																						name={`insured_person[${index}].emergency_contact_last_name`}
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
																		</div>

																		<Controller
																			name={`insured_person[${index}].emergency_contact_address`}
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
																					name={`insured_person[${index}].emergency_contact_address`}
																					error={invalid}
																					helpertext={
																						invalid ? error.message : null
																					}
																					label="Address"
																					type="text"
																					//required
																				/>
																			)}
																		/>

																		<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
																			<Controller
																				control={control}
																				name={`insured_person[${index}].emergency_contact_country`}
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
																						name={`insured_person[${index}].emergency_contact_country`}
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

																			<Controller
																				name={`insured_person[${index}].emergency_contact_telephone`}
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
																							name={`insured_person[${index}].emergency_contact_telephone`}
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
																									`insured_person[${index}].emergency_contact_country`
																								)
																									? watch(
																											`insured_person[${index}].emergency_contact_country`
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
																		</div>
																	</div>

																	<div className="tw-w-full h-fit tw-p-2 tw-gap-10 tw-hidden tw-flex-col tw-justify-start tw-items-start tw-rounded-md tw-shadow-sm">
																		<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
																			Emergency Contact in Ghana
																		</h4>
																		<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
																			<Controller
																				name={`insured_person[${index}].emergency_contact_ghana_first_name`}
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
																						name={`insured_person[${index}].emergency_contact_ghana_first_name`}
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
																			<Controller
																				name={`insured_person[${index}].emergency_contact_ghana_last_name`}
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
																						name={`insured_person[${index}].emergency_contact_ghana_last_name`}
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
																		</div>

																		<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
																			<Controller
																				name={`insured_person[${index}].emergency_contact_ghana_telephone`}
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
																							name={`insured_person[${index}].emergency_contact_ghana_telephone`}
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
																		</div>
																	</div>
																</div>

																{/** Dependant Information Area */}
																<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-10 tw-flex tw-flex-col tw-justify-start tw-items-start">
																	<div className="tw-w-full tw-gap-3 tw-flex tw-flex-col tw-justify-start tw-items-start">
																		<h4 className="tw-w-full tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
																			{/* Health Information */} Dependants
																			Information
																		</h4>
																		<span className="tw-bg-[#7862AF]/20 tw-w-full tw-h-fit tw-p-3 tw-rounded-lg">
																			<p className="tw-w-full tw-text-left tw-text-xs md:tw-text-sm">
																				Travelling with your family? You can add
																				on your spouse and children here
																			</p>
																		</span>
																	</div>

																	<DependantArray
																		nestIndex={index}
																		{...{ control, watch, setValue }}
																	/>
																</div>
															</div>
														</AccordionDetails>
													</MuiAccordion>
												))}
											</div>

											{/* Button to add another traveller  */}
											<div className="tw-w-full tw-flex tw-justify-start tw-items-start">
												<div>
													<div
														onClick={() =>
															append({
																first_name: '',
																last_name: '',
																country: '',
																address: '',
															})
														}
														className="tw-group tw-cursor-pointer tw-w-fit tw-flex tw-justify-start tw-items-center tw-gap-2">
														<div className="tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-6 tw-w-6 tw-text-white tw-bg-[#8e6abf] group-hover:tw-shadow-lg group-hover:tw-shadow-[#8e6abf]/50">
															<IoAdd className="tw-text-base" />
														</div>
														<p className="tw-font-bold tw-text-sm tw-text-[#8e6abf]">
															Add another traveller
														</p>
													</div>
												</div>
											</div>
										</section>
									</>
								)}

								{/* Summary area showing the summary of information provided as well as the total amount payable */}
								{formStep === 2 && (
									<section className="tw-flex tw-flex-col tw-gap-10">
										<div className="tw-flex tw-flex-col tw-gap-8">
											<div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-1">
												{watch(`insured_person`).map((person, index) => (
													<MuiAccordion
														expanded={open === index + 1}
														key={index}
														className="tw-w-full tw-border tw-border-blue-gray-100 tw-px-4 tw-rounded-lg tw-mb-2">
														<AccordionSummary
															expandIcon={
																<MdOutlineExpandMore className="tw-text-3xl" />
															}
															onClick={() => handleOpen(index + 1)}>
															<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-pr-4">
																<div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-start tw-items-start md:tw-items-center tw-gap-3 md:tw-gap-5">
																	<h3 className="tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
																		Traveller {index + 1}
																	</h3>

																	<Typography sx={{ color: 'text.secondary' }}>
																		{person.first_name} {person.last_name}
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
														</AccordionSummary>
														<AccordionDetails>
															{/** Personal Information Area */}

															<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-3 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
																<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#171e41]">
																	Personal Information
																</h4>
																<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-5 tw-rounded-md tw-p-3">
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			Given/First name(s)
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{person['first_name']}
																		</p>
																	</div>
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			Surname/Last name
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{person['last_name']}
																		</p>
																	</div>
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			gender
																		</p>
																		<p className="tw-capitalize tw-font-medium tw-text-base tw-text-[#171e41]">
																			{person['gender']}
																		</p>
																	</div>

																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			passport number
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{person['passport_number']}
																		</p>
																	</div>
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			date of birth
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{dayjs(person['dob']).format(
																				'MMM DD, YYYY'
																			)}
																		</p>
																	</div>
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			email
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{person['email']}
																		</p>
																	</div>
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			telephone
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			+{person['telephone']}
																		</p>
																	</div>
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			address
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{person['address']}
																		</p>
																	</div>
																</div>
															</div>

															{/** Travel Information Area */}

															<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-3 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
																<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#171e41]">
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
																						value === person['country']
																				)[0]?.name
																			}
																		</p>
																	</div>
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			arrival date
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{dayjs(person['arrival_date']).format(
																				'MMM DD, YYYY'
																			)}
																		</p>
																	</div>
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			departure date
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{dayjs(person['departure_date']).format(
																				'MMM DD, YYYY'
																			)}
																		</p>
																	</div>
																	<div className="tw-hidden">
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			address in ghana
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{person['address_ghana']}
																		</p>
																	</div>
																</div>
															</div>

															{/** Emergency Contact Information Area */}

															<div className="tw-w-full tw-hidden tw-h-fit tw-p-2 tw-gap-3 tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
																<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#171e41]">
																	Emergency Contact Information
																</h4>
																<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-5 tw-rounded-md tw-p-3">
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			given/first name
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{person['emergency_contact_first_name']}
																		</p>
																	</div>
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			surname/last name
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{person['emergency_contact_last_name']}
																		</p>
																	</div>
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			address
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{person['emergency_contact_address']}
																		</p>
																	</div>
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			phone number
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			+{person['emergency_contact_telephone']}
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
																						person['emergency_contact_country']
																				)[0]?.name
																			}
																		</p>
																	</div>
																</div>
															</div>

															{/** Emergency Contact in Ghana Information Area */}

															<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-3 tw-hidden tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
																<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#171e41]">
																	Emergency Contact in Ghana Information
																</h4>
																<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-5 tw-rounded-md tw-p-3">
																	<div>
																		<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
																			given/first name
																		</p>
																		<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
																			{
																				person[
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
																				person[
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
																				person[
																					'emergency_contact_ghana_telephone'
																				]
																			}
																		</p>
																	</div>
																</div>
															</div>

															{/** Dependant Information Area */}

															{person.dependants?.length > 0 ? (
																<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-3 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
																	<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#171e41]">
																		Dependants Information
																	</h4>
																	{person.dependants?.map(
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
														</AccordionDetails>
													</MuiAccordion>
												))}
											</div>
										</div>

										<div className="tw-w-full tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-5 tw-bg-white tw-border tw-border-b-black tw-rounded-lg tw-py-3 tw-px-8 tw-shadow-md">
											<h4 className="tw-w-full tw-pb-2 tw-border-b-2 tw-border-[#7862AF] tw-text-tw-left tw-font-title tw-font-medium tw-text-2xl tw-text-[#7862AF]">
												Summary
											</h4>

											{prices.map((traveller, index) => {
												subTotal +=
													traveller?.price * traveller?.no_of_travellers;
												return (
													<div
														key={index}
														className="tw-w-full tw-flex tw-items-center tw-justify-between tw-gap-5 ">
														<div className="tw-flex tw-justify-start tw-items-center tw-gap-2">
															<span className="tw-capitalize tw-w-24 tw-font-normal tw-text-sm tw-text-gray-700 tw-pr-2 tw-border-r-2 tw-border-[#7862AF]">
																Traveller {traveller?.traveller_no}
															</span>

															<p className="tw-text-base">
																{Intl.NumberFormat('en-US', {
																	style: 'currency',
																	currency: 'USD',
																}).format(traveller?.price)}{' '}
																x {traveller?.no_of_travellers}
															</p>
														</div>

														<div className="tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-1">
															<span className="tw-relative tw-flex tw-justify-center tw-items-end tw-gap-1">
																<p className="tw-text-base">
																	{Intl.NumberFormat('en-US', {
																		style: 'currency',
																		currency: 'USD',
																	}).format(
																		traveller?.price *
																			traveller?.no_of_travellers
																	)}
																</p>
															</span>
														</div>
													</div>
												);
											})}

											<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-5 tw-pt-2 tw-border-t-2 tw-border-[#171e41]">
												<span className="tw-capitalize tw-font-normal tw-text-lg tw-text-[#171e41]">
													Sub Total
												</span>

												<h2 className="tw-font-medium tw-text-xl tw-text-[#7862AF] tw-flex tw-justify-center tw-items-end tw-gap-1">
													{Intl.NumberFormat('en-US', {
														style: 'currency',
														currency: 'USD',
													}).format(subTotal)}
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

				{/* Sidebar showing Pricing Summary */}
				<div className="tw-hidden lg:tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-0 tw-bg-white tw-w-[30rem] tw-h-[85vh] tw-overflow-y-auto tw-sticky tw-top-32 tw-right-0 tw-px-10 tw-py-8">
					<p className="tw-font-title tw-font-bold tw-uppercase tw-text-sm tw-text-gray-500 tw-flex tw-justify-center tw-items-end tw-gap-1">
						summary
					</p>

					{watch('insured_person')?.map((traveller, index) => {
						let travelDurationPricing = null;

						if (watch(`insured_person[${index}].duration`)) {
							travelDurationPricing = PRICING?.filter(
								(price) =>
									price?.duration === watch(`insured_person[${index}].duration`)
							);
						}

						return (
							<div
								key={index}
								className="tw-w-full tw-h-fit tw-p-3 tw-mb-4 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-4 tw-rounded-lg tw-border-2 tw-border-t-4 tw-border-t-[#8e6abf]">
								<h2 className="tw-w-full tw-capitalize tw-font-title tw-font-semibold tw-text-xl tw-text-[#8e6abf] tw-flex tw-justify-start tw-items-end tw-gap-1 tw-pb-3 tw-border-b">
									traveller {index + 1}
								</h2>

								<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2 tw-pb-3 tw-border-b">
									<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-[#8e6abf] tw-flex tw-justify-start tw-items-end">
										Traveller details
									</h2>
									<div className="tw-grid tw-grid-cols-2">
										<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600">
											Country / Region
										</div>
										<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-[#8e6abf] tw-font-bold">
											{traveller.country
												? countries.filter(
														({ value }) => value === traveller.country
												  )[0]?.name
												: 'Select Country'}
										</p>
									</div>
									<div className="tw-grid tw-grid-cols-2">
										<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600">
											Effective Date
										</div>
										<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-[#8e6abf] tw-font-bold">
											{dayjs(
												watch(`insured_person[${index}].arrival_date`)
											).isValid()
												? dayjs(
														watch(`insured_person[${index}].arrival_date`)
												  ).format('MMM DD, YYYY')
												: 'Select date'}
										</p>
									</div>
									<div className="tw-grid tw-grid-cols-2">
										<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600">
											Expiry Date
										</div>
										<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-[#8e6abf] tw-font-bold">
											{dayjs(
												watch(`insured_person[${index}].departure_date`)
											).isValid()
												? dayjs(
														watch(`insured_person[${index}].departure_date`)
												  ).format('MMM DD, YYYY')
												: 'Select date'}
										</p>
									</div>
									<div className="tw-grid tw-grid-cols-2">
										<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-600">
											Duration
										</div>
										<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-[#8e6abf] tw-font-bold">
											{travelDurationPricing
												? `${travelDurationPricing[0]?.duration} days`
												: 'Unspecified'}
										</p>
									</div>
									{traveller.dependants?.length > 0 ? (
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-600">
												Dependants
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-[#8e6abf] tw-font-bold">
												{traveller.dependants?.length}
											</p>
										</div>
									) : null}
								</div>
								<div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
									{travelDurationPricing ? (
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
												Price
											</div>

											<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-base tw-text-[#8e6abf] tw-font-bold">
												{travelDurationPricing[0]?.discount > 0 ? (
													<s>
														{Intl.NumberFormat('en-US', {
															style: 'currency',
															currency: 'USD',
														}).format(travelDurationPricing[0]?.price)}
													</s>
												) : (
													<>
														{Intl.NumberFormat('en-US', {
															style: 'currency',
															currency: 'USD',
														}).format(travelDurationPricing[0]?.price)}
													</>
												)}{' '}
												<p className="tw-text-gray-600 tw-font-light tw-text-xs">
													/person
												</p>
											</span>
										</div>
									) : null}
									{travelDurationPricing &&
									travelDurationPricing[0]?.discount > 0 ? (
										<>
											<div className="tw-grid tw-grid-cols-2">
												<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
													Discount
												</div>
												<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-xl tw-text-[#8e6abf] tw-font-bold">
													{travelDurationPricing[0]?.discount} %
												</span>
											</div>
											<div className="tw-grid tw-grid-cols-2">
												<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
													Total Price
												</div>
												<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-xl tw-text-[#8e6abf] tw-font-bold">
													{travelDurationPricing &&
														Intl.NumberFormat('en-US', {
															style: 'currency',
															currency: 'USD',
														}).format(
															travelDurationPricing[0]?.price_after_discount
														)}{' '}
													<p className="tw-text-gray-600 tw-font-light tw-text-xs">
														/person
													</p>
												</span>
											</div>
										</>
									) : null}
								</div>
							</div>
						);
					})}
				</div>

				{/* Loader for saving temporal data */}
				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={saveTemporalData.isLoading}>
					<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
						<CircularProgress color="inherit" />
						<p className="tw-text-white tw-font-medium tw-text-center tw-text-lg tw-w-2/3">
							Please wait
						</p>
					</div>
				</Backdrop>

				{/* Loader for making payment */}
				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={makePayment.isLoading}>
					<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
						<CircularProgress color="inherit" />
						<p className="tw-text-white tw-font-medium tw-text-center tw-text-lg tw-w-2/3">
							Please wait
						</p>
					</div>
				</Backdrop>

				{/* Loader for fetching temporal data */}
				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={temporalData.isFetching}>
					<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
						<CircularProgress color="inherit" />
						<p className="tw-text-white tw-font-medium tw-text-center tw-text-lg tw-w-2/3">
							Please wait
						</p>
					</div>
				</Backdrop>
			</div>
		</>
	);
};

export default Form;
