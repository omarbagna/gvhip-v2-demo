'use client';

import React, { useState } from 'react';
import DashboardNav from '@/components/Layout/Navigations/DashboardNav';
import {
	Avatar,
	Backdrop,
	CircularProgress,
	Skeleton,
	Stack,
} from '@mui/material';
import { HiOutlineLocationMarker, HiOutlineMail } from 'react-icons/hi';
import { BsPhone } from 'react-icons/bs';
//import { TbEdit } from 'react-icons/tb';
//import { axiosPrivate } from 'pages/api/axios';
import { useMutation, useQuery } from 'react-query';
import { Controller, useForm } from 'react-hook-form';
import DefaultInput from '@/components/Input/DefaultInput';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import useAxiosAuth from 'hooks/useAxiosAuth';
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
	const axiosPrivate = useAxiosAuth();

	const [changePasswordModal, setChangePasswordModal] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const { watch, reset, control, handleSubmit } = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			current_password: '',
			new_password: '',
			confirm_password: '',
		},
	});

	const getUserProfile = async () => {
		const response = await axiosPrivate.get('/account/profile');

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

		onError: (error) => {
			toast.error(`${error?.response?.data?.STATUSMSG}`);
			//logout();
		},
		*/

		staleTime: 500000,
	});

	const USER_PROFILE = userProfile?.data?.data?.data
		? userProfile?.data?.data?.data
		: null;

	const triggerPasswordChange = async (data) => {
		const { data: response } = await axiosPrivate.put(
			'/account/change-password',
			data
		);
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
					alert('Password change failed', 'Please try again later', 'error');
				}
			},
			onError: (error) => {
				console.log(error);
			},
		}
	);

	const submitChangePasswordRequest = (data) => {
		const passwordData = JSON.stringify(data);

		changePassword.mutate(passwordData);
	};

	return (
		<div className="tw-w-screen tw-min-h-screen tw-bg-[#FEFBFB] tw-py-20 lg:tw-pt-20 lg:tw-pl-56">
			<DashboardNav />
			<div className="tw-w-full tw-h-full tw-py-10  tw-px-6 md:tw-px-12 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-10">
				<h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold">
					Applicant Profile
				</h2>

				{!userProfile.isLoading && USER_PROFILE && (
					<div className="tw-w-full lg:tw-w-3/4 xl:tw-w-2/3 tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
						<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
							<h3 className="tw-font-medium tw-text-xl">Profile</h3>
							{/** 
						 
						<span className="tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-8 tw-w-8 tw-text-[#8e6abf] hover:tw-text-white hover:tw-bg-[#8e6abf] hover:tw-shadow-lg group-hover:tw-shadow-[#8e6abf]/50">
							<TbEdit className="tw-text-xl" />
						</span>
						*/}
						</div>
						<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-gap-8 tw-pb-8 tw-border-b-2">
							<Avatar
								src="#"
								className="tw-uppercase"
								sx={{ width: '100px', height: '100px' }}>
								{USER_PROFILE?.first_name?.[0]}
							</Avatar>

							<div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-3">
								<h4 className="tw-font-medium tw-text-lg">
									{USER_PROFILE?.first_name}
								</h4>
								<span className="tw-flex tw-justify-start tw-items-center tw-gap-2">
									<HiOutlineLocationMarker className="tw-text-xl tw-shrink-0 tw-text-gray-500" />
									<p className="tw-text-sm">{USER_PROFILE?.last_name}</p>
								</span>
								<span className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-place-content-start tw-place-items-start tw-gap-3">
									<span className="tw-flex tw-justify-start tw-items-center tw-gap-2">
										<HiOutlineMail className="tw-text-xl tw-shrink-0 tw-text-gray-500" />
										<p className="tw-text-sm tw-lowercase">
											{USER_PROFILE?.email}
										</p>
									</span>
									<span className="tw-flex tw-justify-start tw-items-center tw-gap-2">
										<BsPhone className="tw-text-xl tw-shrink-0 tw-text-gray-500" />
										<p className="tw-text-sm">{USER_PROFILE?.telephone}</p>
									</span>
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
				)}

				{userProfile.isLoading && (
					<div className="tw-w-full lg:tw-w-2/3 tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
						<Stack spacing={1} sx={{ width: '100%' }}>
							<Skeleton
								variant="text"
								sx={{ fontSize: '2.5rem', width: '100%' }}
							/>
							<div className="tw-w-full tw-flex tw-justify-start tw-gap-4 tw-items-start">
								<div className="tw-w-fit">
									<Skeleton variant="circular" width={100} height={100} />
								</div>
								<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
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
								</div>
							</div>
							<Skeleton
								variant="text"
								sx={{ fontSize: '1rem', width: '100%' }}
							/>
						</Stack>
					</div>
				)}

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
