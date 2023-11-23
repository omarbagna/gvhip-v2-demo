'use client';

import Link from '@/utils/ActiveLink';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import DefaultInput from '@/components/Input/DefaultInput';
import SelectInput from '@/components/Input/SelectInput';
import { format, differenceInDays, addDays } from 'date-fns';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';

import { countries } from '../../data/countriesData';
import logo from '@/public/images/gsti_logo.jpeg';
import {
	Button,
	Checkbox,
	FormControlLabel,
	FormHelperText,
} from '@mui/material';

import { IoAdd } from 'react-icons/io5';
import { AiOutlineClose } from 'react-icons/ai';

import { MdDelete } from 'react-icons/md';
import Accordion from '@/components/Accordion';
import { planTabsData } from 'data/plansData';

import { TbEdit } from 'react-icons/tb';
import BlurImage from '@/components/BlurImage/BlurImage';

const MAX_STEPS = 3;

const Quote = () => {
	const [formStep, setFormStep] = useState(1);
	const [basicData, setBasicData] = useState(null);
	const [dateState, setDateState] = useState([
		{
			startDate: addDays(new Date(), 1),
			endDate: addDays(new Date(), 29),
			key: 'selection',
		},
	]);
	const [showMore, setShowMore] = useState(null);

	const handleShowDetails = (index) => {
		setShowMore((prev) => (prev === index ? null : index));
	};

	const router = useRouter();

	useEffect(() => {
		const data = window.sessionStorage.getItem('basicData');
		if (data !== null) setBasicData(JSON.parse(data));
	}, []);

	const {
		watch,
		control,
		trigger,
		reset,
		formState: { isValid },
		handleSubmit,
	} = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			country: '',
			insured_person: [{}],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'insured_person',
		rules: { maxLength: 5 },
	});

	const goToNext = () => {
		trigger();
		if (isValid) {
			setFormStep((prev) => prev + 1);
		}
	};
	const goToPrevious = () => {
		setFormStep((prev) => prev - 1);
	};

	useEffect(() => {
		if (basicData) {
			reset({
				country: basicData.country,
				insured_person: basicData.insured_person,
			});
			setDateState([
				{
					startDate: new Date(basicData.start_date),
					endDate: new Date(basicData.end_date),
					key: 'selection',
				},
			]);
		}
	}, [reset, basicData]);

	let duration = Number(
		differenceInDays(
			new Date(dateState[0].endDate),
			new Date(dateState[0].startDate)
		) + 1
	);
	const renderButton = () => {
		if (formStep > 3) {
			return null;
		} else if (formStep === 3) {
			return (
				<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
					<span
						//size="lg"
						className="btn-style-back crimson-color tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-rotate-180 tw-shadow-md tw-justify-center tw-items-center tw-text-3xl"
						onClick={goToPrevious}
						//color="red"
					>
						<i className="bx bx-chevron-right"></i>
					</span>
					<button
						className="btn-style-one dark-green-color"
						//disabled={selectedPlan === null ? true : false}
						type="submit">
						Purchase Plan <i className="bx bx-chevron-right"></i>
					</button>
				</div>
			);
		} else if (formStep === 2) {
			return (
				<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-5">
					<span
						//size="lg"
						className="btn-style-back crimson-color tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-rotate-180 tw-shadow-md tw-justify-center tw-items-center tw-text-3xl"
						onClick={goToPrevious}
						//color="red"
					>
						<i className="bx bx-chevron-right"></i>
					</span>
					<button
						//size="lg"
						className="btn-style-one dark-green-color"
						//disabled={!isValid}
						onClick={goToNext}
						type="button">
						Get Quote <i className="bx bx-chevron-right"></i>
					</button>
				</div>
			);
		} else if (formStep === 5) {
			return (
				<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-5">
					<span
						//size="lg"
						className="btn-style-back crimson-color tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-rotate-180 tw-shadow-md tw-justify-center tw-items-center tw-text-3xl"
						onClick={goToPrevious}
						//color="red"
					>
						<i className="bx bx-chevron-right"></i>
					</span>
					<button
						//size="lg"
						className="btn-style-one dark-green-color"
						//disabled={!isValid}
						onClick={goToNext}
						type="button">
						Next <i className="bx bx-chevron-right"></i>
					</button>
				</div>
			);
		} else if (formStep === 1) {
			return (
				<div className="tw-w-full tw-flex tw-justify-end tw-items-center">
					<button
						//size="lg"
						className="btn-style-one dark-green-color"
						//disabled={!isValid}
						onClick={goToNext}
						type="button">
						Next <i className="bx bx-chevron-right"></i>
					</button>
				</div>
			);
		} else {
			return (
				<div className="tw-w-full tw-flex tw-justify-center tw-items-center tw-gap-5 tw-mt-8">
					<Button
						//size="lg"
						//className="w-full"
						onClick={goToPrevious}
						//color="red"
						//variant="outlined"
						outlined
						type="button">
						back
					</Button>
					<Button
						//size="lg"
						//className="w-full bg-gradient-to-br from-[#7862AF] to-[#171E41]"
						//disabled={!isValid}
						onClick={goToNext}
						type="button">
						Next
					</Button>
				</div>
			);
		}
	};

	const submitForm = (data) => {
		const basicData = JSON.stringify({
			start_date: format(dateState[0]?.startDate, 'yyyy-MM-dd'),
			end_date: format(dateState[0]?.endDate, 'yyyy-MM-dd'),
			country: data?.country,
			insured_person: data?.insured_person,
			//plan: selectedPlan,
		});

		window.sessionStorage.setItem('basicData', basicData);

		router.push(`/form/purchase-plan`);
	};

	return (
		<div className="tw-w-full tw-min-h-screen tw-h-fit tw-flex tw-flex-col tw-justify-start tw-items-center tw-bg-[#FEFBFB]">
			<div className="tw-sticky tw-top-0 tw-z-30 tw-w-full tw-h-fit tw-flex tw-flex-col tw-justify-start tw-items-center tw-gap-3 tw-bg-white tw-shadow-md tw-px-6 tw-py-3 md:tw-py-5 md:tw-px-10 lg:tw-px-20">
				<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
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
						{formStep !== 3
							? 'Lets get some basic information'
							: 'Best plan for you'}
					</h2>

					{formStep !== 3 && (
						<p className="tw-text-sm tw-shrink-0 tw-my-auto tw-block md:tw-hidden">
							Step {formStep}/{MAX_STEPS}
						</p>
					)}

					<Link href="/">
						<span className="tw-cursor-pointer btn-style-back crimson-color tw-rounded-full tw-flex tw-justify-center tw-items-center tw-w-8 tw-h-8 md:tw-w-12 md:tw-h-12 tw-p-2">
							<AiOutlineClose className="tw-text-xl md:tw-text-3xl" />
						</span>
					</Link>
				</div>

				{formStep !== 4 ? (
					<div className="tw-w-full tw-hidden md:tw-flex tw-justify-start tw-items-center tw-gap-3">
						<p className="tw-text-sm tw-pr-2 tw-border-r-2 tw-shrink-0 tw-my-auto">
							Step {formStep} of {MAX_STEPS}
						</p>

						<div className="tw-w-full tw-h-2 tw-bg-slate-300 tw-rounded-full">
							<div
								className="tw-transition-all tw-duration-500 tw-ease-in-out tw-bg-[#8e6abf] tw-h-full tw-rounded-full"
								style={{ width: `${formStep * 33}%` }}
							/>
						</div>
					</div>
				) : null}
			</div>
			<div
				className={
					formStep !== 3
						? 'tw-w-full tw-h-full md:tw-w-5/6 lg:tw-w-4/6 tw-rounded-xl md:tw-shadow-lg md:tw-bg-white tw-mx-auto tw-my-20'
						: 'tw-w-full tw-h-full'
				}>
				<div className="tw-px-4 tw-py-5 md:tw-px-8 md:tw-py-10 tw-w-full tw-h-full">
					<form onSubmit={handleSubmit(submitForm)}>
						{formStep === 1 && (
							<section
								data-aos="fade-up"
								data-aos-duration="1200"
								className="tw-flex tw-flex-col tw-gap-10">
								<div className="tw-w-full tw-flex tw-flex-wrap-reverse tw-gap-3 tw-justify-between tw-items-center">
									<span className="tw-w-fit tw-flex tw-justify-start tw-items-end tw-gap-1">
										<h2 className="tw-font-title tw-font-bold tw-text-2xl lg:tw-text-3xl tw-text-[#171e41] tw-flex tw-justify-center tw-items-end tw-gap-1">
											What country are you travelling from?
										</h2>
									</span>
								</div>
								<div className="tw-relative tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-border-y-2 tw-px-2 tw-py-5 md:tw-p-4">
									<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
										<Controller
											control={control}
											name={`country`}
											defaultValue={''}
											rules={{ required: 'Please select country' }}
											render={({
												field: { ref, ...field },
												fieldState: { error, invalid },
											}) => (
												<SelectInput
													{...field}
													ref={ref}
													error={invalid}
													helpertext={invalid ? error.message : null}
													label="Country of Origin"
													options={countries}
													required
												/>
											)}
										/>
									</div>
								</div>
							</section>
						)}

						{formStep === 5 && (
							<>
								<section
									data-aos="fade-up"
									data-aos-duration="1200"
									className="tw-flex tw-flex-col tw-gap-10">
									<div className="tw-w-full tw-flex tw-flex-wrap-reverse tw-gap-3 tw-justify-between tw-items-center">
										<span className="tw-w-fit tw-flex tw-justify-start tw-items-end tw-gap-1">
											<h2 className="tw-font-title tw-font-bold tw-text-2xl lg:tw-text-3xl tw-text-[#171e41] tw-flex tw-justify-center tw-items-end tw-gap-1">
												How many travellers?
											</h2>
										</span>
									</div>
									<div className="tw-relative tw-w-full tw-flex tw-flex-col tw-gap-5 tw-justify-center tw-items-center tw-border-y-2 tw-px-2 tw-py-5 md:tw-p-4">
										{fields.map((inputField, index) => (
											<div
												data-aos="zoom-in"
												data-aos-duration="500"
												key={inputField.id}
												className="tw-w-full tw-h-full tw-flex tw-gap-8 lg:tw-gap-5 tw-justify-between tw-items-center lg:tw-items-center">
												<div className="tw-w-full tw-h-full tw-flex tw-flex-col lg:tw-flex-row tw-justify-start tw-items-start lg:tw-items-center tw-gap-3">
													<h6 className="tw-font-bold tw-text-lg tw-text-[#8e6abf] tw-shrink-0 tw-mr-5">
														Traveller {index + 1}
													</h6>
													<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-5">
														<Controller
															name={`insured_person[${index}].first_name`}
															control={control}
															defaultValue={''}
															rules={{ required: 'Please enter first name' }}
															render={({
																field: { ref, ...field },
																fieldState: { error, invalid },
															}) => (
																<DefaultInput
																	{...field}
																	ref={ref}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
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
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="Last Name"
																	//max={new Date()}
																	type="text"
																	required
																/>
															)}
														/>
													</div>
												</div>

												{watch('insured_person')?.length > 1 ? (
													<div
														onClick={() => remove(index)}
														className="tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-6 tw-w-6 tw-text-red-500 hover:tw-text-white tw-bg-transparent hover:tw-shadow-lg hover:tw-shadow-red-400/50 hover:tw-bg-red-500 cursor-pointer">
														<MdDelete className="tw-text-base" />
													</div>
												) : (
													<div className="tw-w-6" />
												)}
											</div>
										))}
									</div>
									{watch('insured_person')?.length !== 5 ? (
										<div
											onClick={() =>
												append({
													first_name: '',
													dob: '',
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
									) : null}
								</section>
							</>
						)}

						{formStep === 2 && (
							<section
								data-aos="fade-up"
								data-aos-duration="1200"
								className="tw-flex tw-flex-col tw-gap-10">
								<div className="tw-w-full tw-flex tw-flex-col tw-gap-10 tw-justify-between tw-items-start">
									<span className="tw-w-fit tw-flex tw-justify-start tw-items-end tw-gap-1">
										<h2 className="tw-font-bold tw-text-2xl lg:tw-text-3xl tw-text-[#171e41] tw-flex tw-justify-center tw-items-end tw-gap-1">
											How long do you plan to stay in Ghana?
										</h2>
									</span>
								</div>
								<div className="tw-w-full tw-h-fit tw-flex tw-flex-col tw-justify-center tw-gap-4 tw-items-center tw-border-y-2 tw-px-2 tw-py-5 md:tw-p-4">
									<div className="tw-w-full md:tw-w-fit tw-flex tw-justify-center lg:tw-justify-start tw-items-center tw-gap-2 tw-shrink-0">
										{/**
										<LocalizationProvider
											dateAdapter={AdapterDateFns}
											adapterLocale={enGB}>
											<Controller
												control={control}
												name={`start_date`}
												rules={{ required: 'Please select arrival date' }}
												render={({
													field: { ref, ...field },
													//fieldState: { error, invalid },
												}) => (
													<DatePicker
														{...field}
														ref={ref}
														minDate={new Date()}
														label="Arrival Date"
													/>
												)}
											/>
										</LocalizationProvider>
										-
										<LocalizationProvider
											dateAdapter={AdapterDateFns}
											adapterLocale={enGB}>
											<Controller
												control={control}
												name={`end_date`}
												rules={{ required: 'Please select departure date' }}
												render={({
													field: { ref, ...field },
													//fieldState: { error, invalid },
												}) => (
													<DatePicker
														{...field}
														ref={ref}
														minDate={watch('start_date')}
														maxDate={addDays(watch('start_date'), 89)}
														label="Departure Date"
													/>
												)}
											/>
										</LocalizationProvider>
										 */}
										<div className="lg:tw-block tw-hidden">
											<DateRange
												editableDateInputs={true}
												onChange={(item) => setDateState([item.selection])}
												moveRangeOnFirstSelection={false}
												ranges={dateState}
												months={2}
												direction="horizontal"
												rangeColors={['#8e6abf']}
												minDate={addDays(new Date(), 1)}
												maxDate={addDays(dateState[0].startDate, 179)}
												className="tw-rounded-md tw-shadow-md"
											/>
										</div>
										<div className="lg:tw-hidden tw-block">
											<DateRange
												editableDateInputs={true}
												onChange={(item) => setDateState([item.selection])}
												moveRangeOnFirstSelection={false}
												ranges={dateState}
												rangeColors={['#8e6abf']}
												minDate={addDays(new Date(), 1)}
												maxDate={addDays(dateState[0].startDate, 179)}
												className="tw-rounded-md tw-shadow-md"
											/>
										</div>
									</div>
									<div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center ">
										<p className="tw-font-bold tw-text-base xl:tw-text-lg tw-mb-0 tw-text-[#8e6abf]">
											Duration:{' '}
											{differenceInDays(
												new Date(dateState[0].endDate),
												new Date(dateState[0].startDate)
											) + 1}{' '}
											Days
										</p>
										<p className="tw-text-sm">
											Arrival date and departure date included
											<br />
											<strong>NB:</strong> Insurance covers a period of not more
											than 180 days
										</p>
									</div>
								</div>
							</section>
						)}

						{formStep === 3 && (
							<section
								data-aos="fade-up"
								data-aos-duration="1200"
								className="tw-flex tw-flex-col tw-items-start tw-gap-10">
								<div className="tw-w-full tw-h-full">
									<div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-full">
										<div
											className="tw-w-full tw-flex tw-flex-col md:tw-flex-row-reverse tw-gap-10 tw-justify-center tw-items-start tw-transition-all"
											data-aos="fade-up"
											data-aos-duration="1200">
											<div className="tw-w-full md:tw-w-1/2 xl:tw-w-1/3 tw-h-fit tw-bg-white tw-text-[#8e6abf] tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
												<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
													<h3 className="tw-font-medium tw-text-xl tw-text-[#8e6abf]">
														Standard Plan
													</h3>
												</div>
												<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2 tw-py-3 tw-border-y">
													<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
														Traveller details
													</h2>
													<div className="tw-grid tw-grid-cols-2 tw-place-items-center">
														<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
															Country of Origin
														</div>
														<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-items-center tw-gap-0 tw-text-gray-600 tw-font-bold">
															{watch('country')}
															<span
																onClick={() => setFormStep(1)}
																className="tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-8 tw-w-8 tw-text-[#8e6abf]">
																<TbEdit className="tw-text-xl" />
															</span>
														</p>
													</div>
													<div className="tw-grid tw-grid-cols-2 tw-place-items-center">
														<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
															Effective Date
														</div>
														<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-items-center tw-gap-0 tw-text-gray-600 tw-font-bold">
															{format(
																new Date(dateState[0].startDate),
																'MMM dd, yyyy'
															)}
														</p>
													</div>
													<div className="tw-grid tw-grid-cols-2 tw-place-items-center">
														<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
															Expiry Date
														</div>
														<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-items-center tw-gap-2 tw-text-gray-600 tw-font-bold">
															{format(
																new Date(dateState[0].endDate),
																'MMM dd, yyyy'
															)}
														</p>
													</div>
													<div className="tw-grid tw-grid-cols-2 tw-place-items-center">
														<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
															Duration
														</div>
														<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-items-center tw-gap-0 tw-text-gray-600 tw-font-bold">
															{duration} days
															<span
																onClick={() => setFormStep(2)}
																className="tw-cursor-pointer  tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-8 tw-w-8 tw-text-[#8e6abf]">
																<TbEdit className="tw-text-xl" />
															</span>
														</p>
													</div>
													{/**
													<div className="tw-grid tw-grid-cols-2 tw-place-items-center">
														<div
															onClick={() => setFormStep(2)}
															className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
															No of Travellers
														</div>
														<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-items-center tw-gap-0 tw-text-gray-600 tw-font-bold">
															{watch('insured_person').length}

															<span className="tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-8 tw-w-8 tw-text-[#8e6abf]">
																<TbEdit className="tw-text-xl" />
															</span>
														</p>
													</div>
													 */}
												</div>
												<div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
													<div className="tw-grid tw-grid-cols-2">
														<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
															Price
														</div>
														<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-base tw-text-[#8e6abf] tw-font-bold">
															{duration > 30 ? (
																<s>
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
																				: duration > 150 &&
																				  duration <= 180 &&
																				  270
																		)}
																</s>
															) : (
																<>
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
																				: duration > 150 &&
																				  duration <= 180 &&
																				  270
																		)}
																</>
															)}{' '}
															<p className="tw-text-gray-600 tw-font-light tw-text-xs">
																/person
															</p>
														</span>
													</div>
													{duration && duration > 30 ? (
														<>
															<div className="tw-grid tw-grid-cols-2">
																<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
																	Discount
																</div>
																<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-xl tw-text-[#8e6abf] tw-font-bold">
																	{duration > 30 && duration <= 60
																		? '10'
																		: duration > 60 && duration <= 90
																		? '15'
																		: duration > 90 && duration <= 120
																		? '20'
																		: duration > 120 && duration <= 150
																		? '25'
																		: duration > 150 &&
																		  duration <= 180 &&
																		  '30'}{' '}
																	%
																</span>
															</div>
															<div className="tw-grid tw-grid-cols-2">
																<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
																	Total Price
																</div>
																<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-xl tw-text-[#8e6abf] tw-font-bold">
																	{duration &&
																		Intl.NumberFormat('en-US', {
																			style: 'currency',
																			currency: 'USD',
																		}).format(
																			duration > 30 && duration <= 60
																				? 90 - 90 / 10
																				: duration > 60 && duration <= 90
																				? 135 - 135 / 15
																				: duration > 90 && duration <= 120
																				? 180 - 180 / 20
																				: duration > 120 && duration <= 150
																				? 225 - 225 / 25
																				: duration > 150 &&
																				  duration <= 180 &&
																				  270 - 270 / 30
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
											<div className="tw-w-full md:tw-w-1/2 xl:tw-w-2/3">
												<Accordion questionsAnswers={planTabsData} />
											</div>
										</div>
									</div>
								</div>

								<div className="block tw-mb-10">
									<Controller
										control={control}
										name={'proceed_purchase'}
										defaultValue={false}
										rules={{
											required: 'Please check here to proceed',
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
															checked={watch(`proceed_purchase`)}
														/>
													}
													label={'Proceed to purchase'}
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
						<div className="tw-w-full tw-flex tw-justify-center tw-items-center tw-mt-8 ">
							{renderButton()}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Quote;
