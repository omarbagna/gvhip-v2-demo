'use client';

import React, { useEffect, useState } from 'react';
import DashboardNav from '@/components/Layout/Navigations/DashboardNav';
import {
	Avatar,
	Backdrop,
	CircularProgress,
	FormControl,
	FormHelperText,
	IconButton,
	Skeleton,
	Stack,
	Typography,
} from '@mui/material';
import { HiOutlineLocationMarker, HiOutlineMail } from 'react-icons/hi';
import { BsPhone } from 'react-icons/bs';
//import { TbEdit } from 'react-icons/tb';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Controller, useForm } from 'react-hook-form';
import DefaultInput from '@/components/Input/DefaultInput';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// import baseUrl from '@/utils/baseUrl';
import axios from 'axios';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';
import { IoClose } from 'react-icons/io5';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import SelectInput from '@/components/Input/SelectInput';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { countries } from 'data/countriesData';
import { addDays } from 'date-fns';
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

const Profile = () => {
	const queryClient = useQueryClient();
	const [changePasswordModal, setChangePasswordModal] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [updateProfile, setUpdateProfile] = useState(false);

	const { watch, reset, control, handleSubmit } = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			current_password: '',
			new_password: '',
			confirm_password: '',
		},
	});

	// Fetch User Profile Information
	const getUserProfile = async () => {
		const url = `/api/user/profile`;

		const response = await axios.get(url);

		return response;
	};

	const userProfile = useQuery('profile', getUserProfile, {
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
	});

	const USER_PROFILE = userProfile?.data?.data?.data
		? userProfile?.data?.data?.data
		: null;

	// Fetch User Details
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

	const {
		watch: watchPurchase,
		control: controlPurchase,
		reset: resetPurchase,
		handleSubmit: handleSubmitPurchase,
	} = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			insured_person: {
				dependants: [],
			},
		},
	});

	useEffect(() => {
		if (USER_DETAILS) {
			resetPurchase({
				insured_person: {
					...USER_DETAILS?.travelling_info,
					arrival_date: '',
					departure_date: '',
					dependants: USER_DETAILS?.dependants,
				},
			});
		}
	}, [USER_DETAILS, resetPurchase]);

	// Change User password
	const triggerPasswordChange = async (data) => {
		const url = `/api/user/change-password`;

		const { data: response } = await axios.post(url, data);
		return response;
	};

	const changePassword = useMutation(
		(newPasswordData) => triggerPasswordChange(newPasswordData),
		{
			onSuccess: (data) => {
				if (data?.status === 200) {
					//window.location.replace(data.redirect_url);
					alert('Success', 'Password changed successfully', 'success');

					setChangePasswordModal(false);
					reset();
				} else if (data?.status !== 200) {
					alert('Password change failed', data?.message, 'error');
				}
			},
			onError: async (error) => {
				const message = error?.response?.data?.message;
				toast.error(message);

				if (message?.toLowerCase() === 'unauthenticated.') {
					await signOut({ callbackUrl: '/authentication' });
				}
			},
		}
	);

	const submitChangePasswordRequest = (data) => {
		const passwordData = data;

		changePassword.mutate(passwordData);
	};

	// Update User profile
	const triggerUpdateProfile = async (data) => {
		toast.loading('Updating Profile', {
			toastId: 'updatingProfile',
		});

		const url = `/api/user/update-profile`;

		const { data: response } = await axios.post(url, data);
		return response;
	};

	const updateProfileRequest = useMutation(
		(newProfileData) => triggerUpdateProfile(newProfileData),
		{
			onSuccess: (data) => {
				console.log(data);
				if (data?.status === 200) {
					toast.update('updatingProfile', {
						render: 'Profile updated successfully',
						type: 'success',
						isLoading: false,
						autoClose: false,
						closeButton: true,
					});
					queryClient.invalidateQueries({ queryKey: ['user'] });
					setUpdateProfile(false);
					resetPurchase();
				} else if (data?.status !== 200) {
					toast.update('updatingProfile', {
						render: data?.message,
						type: 'error',
						isLoading: false,
						autoClose: 4500,
					});
				}
			},
			onError: async (error) => {
				const message = error?.response?.data?.message;
				toast.update('updatingProfile', {
					render: message,
					type: 'error',
					isLoading: false,
					autoClose: 4500,
				});

				if (message?.toLowerCase() === 'unauthenticated.') {
					await signOut({ callbackUrl: '/authentication' });
				}
			},
		}
	);

	const submitUpdateProfile = (data) => {
		const updateData = {
			telephone: data?.insured_person?.telephone,
			address: data?.insured_person?.address,
			emergency_contact_address:
				data?.insured_person?.emergency_contact_address,
			emergency_contact_country:
				data?.insured_person?.emergency_contact_country,
			emergency_contact_first_name:
				data?.insured_person?.emergency_contact_first_name,
			emergency_contact_ghana_first_name:
				data?.insured_person?.emergency_contact_ghana_first_name,
			emergency_contact_ghana_last_name:
				data?.insured_person?.emergency_contact_ghana_last_name,
			emergency_contact_ghana_telephone:
				data?.insured_person?.emergency_contact_ghana_telephone,
			emergency_contact_last_name:
				data?.insured_person?.emergency_contact_last_name,
			emergency_contact_telephone:
				data?.insured_person?.emergency_contact_telephone,
		};

		updateProfileRequest.mutate(updateData);
	};

	return (
		<div className="tw-w-full tw-min-h-screen tw-bg-[#FEFBFB] tw-py-20 lg:tw-pt-20 lg:tw-pl-56">
			<DashboardNav />
			<div className="tw-w-full tw-h-full tw-py-10  tw-px-6 md:tw-px-12 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-10">
				<h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold">
					Applicant Profile
				</h2>

				<div className="tw-w-full tw-grid grid-cols-1 md:tw-grid-cols-2 tw-gap-3">
					{!userProfile.isLoading && USER_PROFILE ? (
						<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
								<h3 className="tw-font-medium tw-text-xl">Profile</h3>
								{/** 
						 
						<span className="tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-8 tw-w-8 tw-text-[#8e6abf] hover:tw-text-white hover:tw-bg-[#8e6abf] hover:tw-shadow-lg group-hover:tw-shadow-[#8e6abf]/50">
							<TbEdit className="tw-text-xl" />
						</span>
						*/}
							</div>
							<div className="tw-w-full tw-flex tw-flex-col xl:tw-flex-row tw-justify-start tw-items-center tw-gap-8 tw-pb-8 tw-border-b-2">
								<div className="tw-hidden md:tw-block">
									<Avatar
										src="#"
										className="tw-uppercase"
										sx={{ width: '100px', height: '100px' }}>
										{USER_PROFILE?.first_name?.[0]}
										{USER_PROFILE?.last_name?.[0]}
									</Avatar>
								</div>

								<div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-3">
									<h4 className="tw-font-medium tw-text-lg">
										{USER_PROFILE?.first_name} {USER_PROFILE?.last_name}
									</h4>
									<span className="tw-flex tw-justify-start tw-items-center tw-gap-2">
										<HiOutlineLocationMarker className="tw-text-xl tw-shrink-0 tw-text-gray-500" />
										<p className="tw-text-sm">{USER_PROFILE?.country}</p>
									</span>
									<span className="tw-flex tw-justify-start tw-items-center tw-gap-2">
										<HiOutlineMail className="tw-text-xl tw-shrink-0 tw-text-gray-500" />
										<p className="tw-text-sm tw-lowercase">
											{USER_PROFILE?.email}
										</p>
									</span>
									<span className="tw-w-full tw-flex tw-justify-start tw-items-center tw-gap-2">
										<BsPhone className="tw-text-xl tw-shrink-0 tw-text-gray-500" />
										<p className="tw-text-sm">+{USER_PROFILE?.telephone}</p>
									</span>
								</div>
							</div>
							<div className="tw-w-full tw-flex tw-justify-end tw-items-center">
								<span
									onClick={() => setChangePasswordModal((prev) => !prev)}
									className="tw-cursor-pointer tw-font-bold tw-text-sm tw-text-[#8e6abf] tw-p-2 tw-rounded-lg hover:tw-bg-[#8e6abf]/10">
									Change password
								</span>
							</div>
						</div>
					) : (
						<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<Stack spacing={1} sx={{ width: '100%' }}>
								<Skeleton
									variant="text"
									sx={{ fontSize: '2rem', width: '40%' }}
								/>
								<div className="tw-w-full tw-flex tw-justify-start tw-gap-4 tw-items-start">
									<div className="tw-w-fit">
										<Skeleton variant="circular" width={100} height={100} />
									</div>
									<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
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
											sx={{ fontSize: '1rem', width: '50%' }}
										/>
									</div>
								</div>
								<div className="tw-w-full tw-flex tw-justify-end tw-border-t tw-pt-4">
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '35%' }}
									/>
								</div>
							</Stack>
						</div>
					)}

					{!userDetails.isLoading && USER_DETAILS ? (
						<div className="tw-w-full tw-h-fit md:tw-row-start-1 md:tw-col-start-1 tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
								<h3 className="tw-font-medium tw-text-xl">Additional Info</h3>
							</div>

							<div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-3">
								{/** Emergency Contact Information Area */}

								<div className="tw-w-full tw-flex tw-h-fit tw-p-2 tw-gap-3 tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
									<h4 className="tw-w-fit tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium !tw-text-md tw-text-[#171e41]">
										Emergency Contact Information
									</h4>
									<div className="tw-w-full tw-grid tw-grid-cols-1 xl:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-5 tw-rounded-md tw-p-3">
										<div>
											<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
												given/first name
											</p>
											<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
												{
													USER_DETAILS?.travelling_info[
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
													USER_DETAILS?.travelling_info[
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
													USER_DETAILS?.travelling_info[
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
													USER_DETAILS?.travelling_info[
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
													USER_DETAILS?.travelling_info[
														'emergency_contact_country'
													]
												}
											</p>
										</div>
									</div>
								</div>

								{/** Emergency Contact in Ghana Information Area */}

								<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-3 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-[#171e41] tw-pb-4">
									<h4 className="tw-w-fit tw-pb-2 tw-border-b-2 tw-border-[#171e41] tw-text-tw-left tw-font-title tw-font-medium !tw-text-md tw-text-[#171e41]">
										Emergency Contact in Ghana Information
									</h4>
									<div className="tw-w-full tw-grid tw-grid-cols-1 xl:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-5 tw-rounded-md tw-p-3">
										<div>
											<p className="tw-capitalize tw-font-normal tw-text-xs tw-text-gray-500">
												given/first name
											</p>
											<p className="tw-font-medium tw-text-base tw-text-[#171e41]">
												{
													USER_DETAILS?.travelling_info[
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
													USER_DETAILS?.travelling_info[
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
													USER_DETAILS?.travelling_info[
														'emergency_contact_ghana_telephone'
													]
												}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="tw-w-full tw-flex tw-justify-end tw-items-center">
								<span
									onClick={() => setUpdateProfile((prev) => !prev)}
									className="tw-cursor-pointer tw-font-bold tw-text-sm tw-text-[#8e6abf] tw-p-2 tw-rounded-lg hover:tw-bg-[#8e6abf]/10">
									Update Info
								</span>
							</div>
						</div>
					) : (
						<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
							<Stack spacing={1} sx={{ width: '100%' }}>
								<Skeleton
									variant="text"
									sx={{ fontSize: '2rem', width: '40%' }}
								/>

								<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '37%' }}
									/>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '45%' }}
									/>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '30%' }}
									/>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '50%' }}
									/>
								</div>
								<div className="tw-w-full tw-flex tw-justify-end tw-border-t tw-pt-4">
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '35%' }}
									/>
								</div>
							</Stack>
						</div>
					)}
				</div>

				{changePasswordModal && (
					<div
						onClick={() => setChangePasswordModal((prev) => !prev)}
						className="tw-fixed tw-top-0 tw-left-0 tw-z-[999] tw-flex tw-justify-center tw-items-center tw-w-screen tw-h-screen tw-bg-black/50">
						<div
							data-aos="zoom-in"
							data-aos-duration="600"
							onClick={(e) => e.stopPropagation()}
							className="tw-font-medium tw-text-center tw-text-lg tw-w-5/6 md:tw-w-2/3 lg:tw-w-1/2 tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
							<div className="tw-w-full">
								<form onSubmit={handleSubmit(submitChangePasswordRequest)}>
									<div className="tw-w-full tw-flex tw-flex-col tw-gap-4 tw-pb-3">
										<h2 className="tw-w-full tw-font-medium tw-text-2xl tw-text-[#524380] tw-flex tw-justify-start tw-items-end">
											Change Password
										</h2>

										<Controller
											name={'current_password'}
											control={control}
											rules={{
												required: 'Please enter your current password',
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
													label="Current Password"
													type={showPassword ? 'text' : 'password'}
													required
												/>
											)}
										/>
										<Controller
											name={'new_password'}
											control={control}
											rules={{
												required: 'Please enter your new password',
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
													label="New Password"
													type={showPassword ? 'text' : 'password'}
													required
												/>
											)}
										/>
										<Controller
											name={'confirm_password'}
											control={control}
											rules={{
												required: 'Please confirm password',
												validate: (value) =>
													value === watch('new_password') ||
													'The passwords do not match',
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
													label="Confirm Password"
													type={showPassword ? 'text' : 'password'}
													required
												/>
											)}
										/>

										<div className="tw-w-full tw-flex tw-justify-between tw-items-end">
											<span
												onClick={() => setShowPassword((prev) => !prev)}
												className="tw-cursor-pointer tw-font-bold tw-text-sm tw-text-gray-600 tw-p-2 tw-rounded-lg hover:tw-bg-[#8e6abf]/10">
												{showPassword ? 'Hide' : 'Show'} password
											</span>
											<button
												className="btn-style-one dark-green-color"
												type="submit">
												Change Password <i className="bx bx-chevron-right"></i>
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				)}

				{/* Update Profile Modal */}
				{updateProfile && (
					<div
						onClick={() => setUpdateProfile((prev) => !prev)}
						className="tw-fixed tw-top-0 tw-left-0 tw-z-[999] tw-flex tw-justify-center tw-items-center tw-w-screen tw-h-screen tw-bg-black/50">
						<div
							data-aos="zoom-in"
							data-aos-duration="600"
							onClick={(e) => e.stopPropagation()}
							className="tw-font-medium tw-relative tw-text-center tw-text-lg tw-w-11/12 tw-max-h-[95vh] tw-h-full tw-bg-white tw-shadow-sm tw-rounded-lg tw-pb-5 tw-px-8 tw-flex tw-flex-col tw-justify-start tw-items-center tw-gap-5 tw-overflow-y-auto">
							<div className="tw-w-full tw-sticky tw-top-0 tw-flex tw-py-3 tw-border-b-2 tw-bg-white tw-z-10">
								<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-pb-2">
									<h2 className="tw-font-medium tw-text-2xl tw-text-[#7862AF]">
										Update Profile
									</h2>
									<IconButton
										aria-label="close scanner"
										onClick={() => setUpdateProfile(false)}>
										<IoClose className="tw-text-xl tw-text-[#8e6abf]" />
									</IconButton>
								</div>
							</div>
							<div className="tw-w-full tw-rounded-xl tw-mx-auto">
								<div className="tw-px-4 tw-py-5 md:tw-px-8 md:tw-py-10">
									<form onSubmit={handleSubmitPurchase(submitUpdateProfile)}>
										<section className="tw-flex tw-flex-col tw-gap-3">
											<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-pr-4">
												<div className="tw-grid tw-grid-cols-2 md:tw-flex tw-justify-start tw-items-start md:tw-items-center tw-gap-3 md:tw-gap-5">
													<h3 className="tw-text-tw-left tw-font-title tw-font-medium tw-text-xl tw-text-[#171e41]">
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
														{watchPurchase(`insured_person.first_name`)}{' '}
														{watchPurchase(`insured_person.last_name`)}
													</Typography>
												</div>
											</div>

											<div className="tw-relative tw-w-full tw-h-full tw-flex tw-flex-col tw-gap-5 tw-justify-center tw-items-center ">
												{/** Contact Information Area */}
												<div className="tw-w-full tw-h-fit tw-p-2 tw-gap-10 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-y-2 tw-border-[#171e41] tw-py-10">
													<div className="tw-w-full tw-gap-3 tw-flex tw-flex-col tw-justify-start tw-items-start">
														<h4 className="tw-w-full tw-text-left tw-font-title tw-font-medium tw-text-xl tw-text-[#7862AF]">
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
														<Controller
															name={`insured_person.email`}
															control={controlPurchase}
															defaultValue={''}
															rules={{
																pattern: {
																	value:
																		/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/gi,
																	message: 'Please enter a valid email address',
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
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="Email"
																	type="email"
																	required
																	disabled
																/>
															)}
														/>
														<Controller
															name={`insured_person.telephone`}
															control={controlPurchase}
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
																			borderColor: invalid ? 'red' : '#616B7D',
																		}}
																		country={'us'}
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
														name={`insured_person.address`}
														control={controlPurchase}
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
																error={invalid}
																helpertext={invalid ? error.message : null}
																label="Address in Home Country"
																type="text"
																required
															/>
														)}
													/>

													<div className="tw-w-full h-fit tw-p-2 tw-gap-10 tw-flex tw-flex-col tw-justify-start tw-items-start tw-rounded-md tw-shadow-sm ">
														<h4 className="tw-w-full tw-text-left tw-font-title tw-font-medium tw-text-xl tw-text-[#7862AF] tw-hidden md:tw-block">
															Emergency Contact Information
														</h4>
														<h4 className="tw-w-full tw-text-left tw-font-title tw-font-medium tw-text-xl tw-text-[#7862AF] md:tw-hidden">
															Emergency Contact Info
														</h4>

														<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:md:tw-grid-cols-3 tw-gap-5">
															<Controller
																name={`insured_person.emergency_contact_first_name`}
																control={controlPurchase}
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
																		helpertext={invalid ? error.message : null}
																		label="Given / First Name"
																		type="text"
																		required
																	/>
																)}
															/>
															<Controller
																name={`insured_person.emergency_contact_last_name`}
																control={controlPurchase}
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
																		label="Surname / Last Name"
																		type="text"
																		required
																	/>
																)}
															/>

															<Controller
																control={controlPurchase}
																name={`insured_person.emergency_contact_country`}
																defaultValue={watchPurchase('country')}
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
																		error={invalid}
																		helpertext={invalid ? error.message : null}
																		label="Country"
																		options={countries}
																		required
																	/>
																)}
															/>
														</div>

														<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
															<Controller
																name={`insured_person.emergency_contact_address`}
																control={controlPurchase}
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
																		error={invalid}
																		helpertext={invalid ? error.message : null}
																		label="Address"
																		type="text"
																		required
																	/>
																)}
															/>

															<Controller
																name={`insured_person.emergency_contact_telephone`}
																control={controlPurchase}
																defaultValue={''}
																rules={{
																	pattern: {
																		value:
																			/\+?(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/gi,
																		message:
																			'Please enter a valid phone number. Phone number must follow the international standard',
																	},
																	required: 'Please enter phone number',
																}}
																render={({
																	field: { ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<FormControl error={invalid} required>
																		<PhoneInput
																			{...field}
																			ref={ref}
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
																			country={
																				watchPurchase(
																					`insured_person.emergency_contact_country`
																				)
																					? watchPurchase(
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
														</div>
													</div>

													<div className="tw-w-full h-fit tw-p-2 tw-gap-10 tw-flex tw-flex-col tw-justify-start tw-items-start tw-rounded-md tw-shadow-sm">
														<h4 className="tw-w-full tw-text-left tw-font-title tw-font-medium tw-text-xl tw-text-[#7862AF]">
															Emergency Contact in Ghana
														</h4>
														<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:md:tw-grid-cols-3 tw-gap-5">
															<Controller
																name={`insured_person.emergency_contact_ghana_first_name`}
																control={controlPurchase}
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
																		helpertext={invalid ? error.message : null}
																		label="Given / First Name"
																		type="text"
																		required
																	/>
																)}
															/>
															<Controller
																name={`insured_person.emergency_contact_ghana_last_name`}
																control={controlPurchase}
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
																		label="Surname / Last Name"
																		type="text"
																		required
																	/>
																)}
															/>

															<Controller
																name={`insured_person.emergency_contact_ghana_telephone`}
																control={controlPurchase}
																defaultValue={''}
																rules={{
																	pattern: {
																		value:
																			/\+?(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/gi,
																		message:
																			'Please enter a valid phone number. Phone number must follow the international standard',
																	},
																	required: 'Please enter phone number',
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
											</div>
										</section>

										<div className="tw-w-full tw-flex tw-justify-end tw-items-end tw-mt-4">
											<div className="tw-w-full lg:w-1/2 tw-flex tw-justify-end tw-items-end">
												<div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-5">
													<span
														className="btn-style-back crimson-color tw-w-fit tw-h-fit tw-rounded-full tw-flex tw-shadow-md tw-justify-center tw-items-center tw-text-base tw-px-3 tw-cursor-pointer tw-py-2"
														onClick={() => setUpdateProfile(false)}>
														Cancel
													</span>
													<button
														className="btn-style-one dark-green-color"
														type="submit">
														Update <i className="bx bx-chevron-right"></i>
													</button>
												</div>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				)}

				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={changePassword.isLoading}>
					<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
						<CircularProgress color="inherit" />
						<p className="tw-text-white tw-font-medium tw-text-center tw-text-lg tw-w-2/3">
							Changing password, please wait...
						</p>
					</div>
				</Backdrop>

				{!userProfile.isLoading && !USER_PROFILE && (
					<h2>Failed to load data. Please reload this page to try again</h2>
				)}
			</div>
		</div>
	);
};

export default Profile;
