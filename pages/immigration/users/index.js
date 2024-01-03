'use client';

import React, { useState } from 'react';
import DashboardNav from '@/components/Layout/Navigations/DashboardNav';
import { Chip, Skeleton, Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import baseUrl from '@/utils/baseUrl';
import axios from 'axios';
import UsersTable from '@/components/Table/UsersTable';
import { useStateContext } from 'context/StateContext';
import { AiOutlineClose } from 'react-icons/ai';
import { Controller, useForm } from 'react-hook-form';
import { signOut, useSession } from 'next-auth/react';
import DefaultInput from '@/components/Input/DefaultInput';
import SelectInput from '@/components/Input/SelectInput';
import { toast } from 'react-toastify';

const columns = [
	{
		Header: 'First name',
		accessor: 'first_name',
	},
	{
		Header: 'Last name',
		accessor: 'last_name',
	},
	{
		Header: 'Email',
		accessor: 'email',
	},
	{
		Header: 'Role',
		accessor: 'access',
	},
	{
		Header: 'Status',
		accessor: 'status',
		Cell: ({ value }) => {
			if (value) {
				return (
					<Chip
						label={value?.toUpperCase()}
						size="small"
						variant="filled"
						color={
							value.toUpperCase() === 'INACTIVE'
								? 'error'
								: value.toUpperCase() === 'ACTIVE'
								? 'success'
								: 'secondary'
						}
					/>
				);
			}
		},
	},
];

const Users = () => {
	const { data: session, status } = useSession();
	const queryClient = useQueryClient();
	const { viewUser, setViewUser, viewUserData, setViewUserData } =
		useStateContext();

	const [addNewUser, setAddNewUser] = useState(false);
	const [editUser, setEditUser] = useState(false);
	const [resetUserPassword, setResetUserPassword] = useState(false);

	// Fetch Users list
	const getUsers = async () => {
		const url = `${baseUrl}/api/admin/get-users`;

		const response = await axios.get(url);

		return response;
	};

	const usersData = useQuery('users', getUsers, {
		onError: async (error) => {
			const message = error?.response?.data?.message;
			toast.error(message);

			if (message?.toLowerCase() === 'unauthenticated.') {
				await signOut({ callbackUrl: '/authentication' });
			}
		},
	});

	const USERS_DATA = usersData?.data?.data?.data
		? usersData?.data?.data?.data
		: null;

	// Fetch Individual User Data
	const getUser = async () => {
		const url = `${baseUrl}/api/admin/show-user`;

		const response = await axios.post(url, { id: viewUserData?.id });

		return response;
	};

	const userData = useQuery(['user', viewUserData?.id], getUser, {
		onError: async (error) => {
			const message = error?.response?.data?.message;
			toast.error(message);

			if (message?.toLowerCase() === 'unauthenticated.') {
				await signOut({ callbackUrl: '/authentication' });
			}
		},

		enabled: viewUser,
	});

	const USER_DATA = userData?.data?.data?.data
		? userData?.data?.data?.data
		: null;

	// Add a New User
	const {
		//watch: watchNewUser,
		reset: resetNewUser,
		control: controlNewUser,
		handleSubmit: handleNewUserSubmit,
	} = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			agency: session?.user?.user?.agency,
		},
	});

	const triggerCreateUser = async (data) => {
		toast.loading('Creating user', {
			toastId: 'creatingUser',
		});

		const url = `${baseUrl}/api/admin/create-user`;

		const { data: response } = await axios.post(url, data);
		return response;
	};

	const createUser = useMutation(
		(createUserData) => triggerCreateUser(createUserData),
		{
			onSuccess: (data) => {
				if (data?.status === 200) {
					//window.location.replace(data.redirect_url);
					toast.update('creatingUser', {
						render: 'User created',
						type: 'success',
						isLoading: false,
						autoClose: false,
						closeButton: true,
					});
					queryClient.invalidateQueries({ queryKey: ['users'] });
					resetNewUser();
				} else if (data?.status !== 200) {
					toast.update('creatingUser', {
						render: 'Failed to create user. Please try again later',
						type: 'error',
						isLoading: false,
						autoClose: 4500,
					});
				}
			},
			onError: async (error) => {
				const message = error?.response?.data?.message;
				toast.update('creatingUser', {
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

	const submitNewUserForm = (data) => {
		createUser.mutate(data);
	};

	// Edit a User
	const {
		//watch: watchEditUser,
		reset: resetEditUser,
		control: controlEditUser,
		handleSubmit: handleEditUserSubmit,
	} = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			agency: session?.user?.user?.agency,
		},
	});

	const triggerEditUser = async (data) => {
		toast.loading('Editing user', {
			toastId: 'editingUser',
		});

		const url = `${baseUrl}/api/admin/edit-user`;

		const { data: response } = await axios.post(url, data);

		return response;
	};

	const updateUser = useMutation(
		(editUserData) => triggerEditUser(editUserData),
		{
			onSuccess: (data) => {
				if (data?.status === 200) {
					//window.location.replace(data.redirect_url);
					toast.update('editingUser', {
						render: 'User edited',
						type: 'success',
						isLoading: false,
						autoClose: false,
						closeButton: true,
					});
					queryClient.invalidateQueries({ queryKey: ['users'] });
					queryClient.invalidateQueries({ queryKey: ['user'] });
					setEditUser(false);
					resetEditUser();
				} else if (data?.status !== 200) {
					toast.update('editingUser', {
						render: 'Failed to edit user. Please try again later',
						type: 'error',
						isLoading: false,
						autoClose: 4500,
					});
				}
			},
			onError: async (error) => {
				const message = error?.response?.data?.message;
				toast.update('editingUser', {
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

	const submitEditUserForm = (data) => {
		const editData = { ...data, id: viewUserData?.id };
		updateUser.mutate(editData);
	};

	// Reset user password
	const triggerPasswordReset = async (data) => {
		const url = `${baseUrl}/api/send-reset-link`;

		toast.loading('Sending reset link', {
			toastId: 'sendingLink',
		});
		const { data: response } = await axios.post(url, data);

		return response;
	};

	const resetPassword = useMutation(
		(resetPasswordData) => triggerPasswordReset(resetPasswordData),
		{
			onSuccess: (data) => {
				if (data?.status === 200) {
					//window.location.replace(data.redirect_url);
					toast.update('sendingLink', {
						render: 'Reset link sent successfully',
						type: 'success',
						isLoading: false,
						autoClose: false,
						closeButton: true,
					});
				} else if (data?.status !== 200) {
					toast.update('sendingLink', {
						render: 'Failed to send rest link. Please try again later',
						type: 'error',
						isLoading: false,
						autoClose: 4500,
					});
				}
			},
			onError: (error) => {
				console.log(error);
				toast.update('sendingLink', {
					render: error?.data?.message,
					type: 'error',
					isLoading: false,
					autoClose: 4500,
				});
			},
		}
	);

	const resetPasswordRequest = (data) => {
		resetPassword.mutate(data);
	};

	return (
		<div className="tw-w-full tw-min-h-screen tw-bg-[#FEFBFB] tw-py-20 lg:tw-pt-20 lg:tw-pl-56">
			<DashboardNav />
			<div className="tw-w-full tw-h-full tw-py-10 tw-px-6 md:tw-px-12 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-10">
				<div className="tw-w-full tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-gap-6">
					<h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold">Users</h2>

					{usersData.isLoading ? (
						<div className="tw-w-fit tw-flex tw-justify-center tw-items-center tw-gap-3">
							<Skeleton
								variant="text"
								sx={{ fontSize: '2rem', width: '70px' }}
							/>
						</div>
					) : (
						<div className="tw-w-fit tw-flex tw-justify-center tw-items-center tw-gap-3">
							<div
								onClick={() => setAddNewUser(true)}
								className={`tw-group tw-transition-all tw-text-sm tw-duration-200 tw-ease-in-out tw-p-1 tw-px-2 tw-rounded-md hover:tw-bg-[#8D69BF] hover:tw-text-white tw-bg-[#FFECF4] tw-text-[#8D69BF] tw-cursor-pointer`}>
								Add new user
							</div>
						</div>
					)}
				</div>

				{!usersData.isLoading && USERS_DATA && (
					<>
						<UsersTable COLUMNS={columns} DATA={USERS_DATA} />
					</>
				)}

				{usersData.isLoading && (
					<>
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

				{!usersData.isLoading && !USERS_DATA && (
					<h2>Failed to load data. Please reload this page to try again</h2>
				)}
			</div>

			{addNewUser && (
				<div
					className="tw-fixed tw-top-0 tw-left-0 tw-z-[999] tw-w-screen tw-h-screen tw-bg-black/20 tw-backdrop-blur-sm tw-flex tw-justify-center tw-items-center"
					onClick={() => {
						setAddNewUser(false);
					}}>
					<div
						data-aos="zoom-in"
						data-aos-duration="800"
						className="tw-rounded-xl tw-bg-white tw-w-full md:tw-w-3/5 lg:tw-w-2/3 tw-h-full md:tw-h-fit tw-px-5 tw-py-5 tw-flex tw-flex-col overflow-auto"
						onClick={(e) => e.stopPropagation()}>
						<div className="section-title tw-flex !tw-max-w-full !tw-mx-2 tw-justify-between tw-items-center !tw-mb-0">
							<h2 className="nunito-font">Add New User</h2>

							<span
								className="tw-cursor-pointer btn-style-back crimson-color tw-rounded-full tw-flex tw-justify-center tw-items-center tw-w-8 tw-h-8 tw-p-2"
								onClick={() => {
									setAddNewUser(false);
								}}>
								<AiOutlineClose className="tw-text-xl md:tw-text-3xl" />
							</span>
						</div>

						<div className="tw-w-full tw-h-full">
							<div className="tw-w-full tw-h-fit tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
								<div className="tw-w-full tw-flex tw-flex-col tw-space-y-6 tw-py-3 tw-border-t">
									<form onSubmit={handleNewUserSubmit(submitNewUserForm)}>
										<div className="tw-w-full tw-pb-3 tw-border-b">
											<div className="tw-w-full tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-5">
												<Controller
													name={`first_name`}
													control={controlNewUser}
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
															name={`first_name`}
															helpertext={invalid ? error.message : null}
															label="First Name"
															type="text"
															required
														/>
													)}
												/>
												<Controller
													name={`last_name`}
													control={controlNewUser}
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
															name={`last_name`}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Last Name"
															type="text"
															required
														/>
													)}
												/>

												<Controller
													name={`email`}
													control={controlNewUser}
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
															name={`email`}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Email"
															type="email"
															required
														/>
													)}
												/>

												<Controller
													name={`access`}
													control={controlNewUser}
													defaultValue={''}
													rules={{
														required: 'Please select role',
													}}
													render={({
														field: { ref, ...field },
														fieldState: { error, invalid },
													}) => (
														<SelectInput
															{...field}
															ref={ref}
															name={`access`}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Role"
															options={[
																{
																	name: 'admin',
																	value: 'admin',
																},
																{
																	name: 'staff',
																	value: 'staff',
																},
															]}
															required
														/>
													)}
												/>
											</div>
										</div>
										<div className="tw-w-full tw-flex tw-justify-end tw-gap-10 tw-items-center tw-mt-6">
											<span
												className="btn-style-back red-light-color tw-w-fit tw-h-fit tw-rounded-lg tw-px-4 tw-py-2 tw-flex tw-shadow-md tw-justify-center tw-items-center tw-text-base tw-cursor-pointer"
												onClick={() => {
													setAddNewUser(false);
													resetNewUser();
												}}>
												Cancel
											</span>
											<button
												className="btn-style-one dark-green-color !tw-px-4 !tw-py-2"
												type="submit">
												Add
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{viewUser && (
				<div
					className="tw-fixed tw-top-0 tw-left-0 tw-z-[999] tw-w-screen tw-h-screen tw-bg-black/20 tw-backdrop-blur-sm tw-flex tw-justify-center tw-items-center"
					onClick={() => {
						setViewUser(false);
						setViewUserData(null);
					}}>
					<div
						data-aos="zoom-in"
						data-aos-duration="800"
						className="tw-rounded-xl tw-bg-white tw-w-full md:tw-w-4/5 lg:tw-w-2/3 tw-h-full md:tw-h-fit tw-px-5 tw-py-5 tw-flex tw-flex-col overflow-auto"
						onClick={(e) => e.stopPropagation()}>
						<div className="section-title tw-flex !tw-max-w-full !tw-mx-2 tw-justify-between tw-items-center !tw-mb-0">
							<h2 className="nunito-font">User Info</h2>

							<span
								className="tw-cursor-pointer btn-style-back crimson-color tw-rounded-full tw-flex tw-justify-center tw-items-center tw-w-8 tw-h-8 tw-p-2"
								onClick={() => {
									setViewUser(false);
									setViewUserData(null);
								}}>
								<AiOutlineClose className="tw-text-xl md:tw-text-3xl" />
							</span>
						</div>

						<div className="tw-w-full tw-h-full">
							{!userData.isLoading && viewUserData && USER_DATA ? (
								<div className="tw-w-full tw-h-fit tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
									{!editUser ? (
										<div className="tw-w-full tw-flex tw-justify-start tw-gap-4 tw-items-start">
											<div className="tw-h-full tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-5 tw-pt-3">
												<div className="tw-flex tw-items-end tw-justify-start tw-gap-3">
													<h3 className="tw-font-semibold tw-text-lg md:tw-text-xl tw-text-[#8e6abf]">
														{USER_DATA?.first_name} {USER_DATA?.last_name}
													</h3>

													<span
														className={`tw-group tw-transition-all tw-capitalize tw-text-xs tw-duration-200 tw-ease-in-out tw-p-1 tw-px-2 tw-rounded-md hover:tw-bg-[#8D69BF] hover:tw-text-white tw-bg-[#FFECF4] tw-text-[#8D69BF] tw-cursor-default`}>
														{USER_DATA?.access}
													</span>
												</div>
												<div
													className={`tw-group tw-transition-all tw-capitalize tw-text-sm tw-duration-200 tw-ease-in-out tw-p-1 tw-px-2 tw-rounded-full ${
														USER_DATA?.status?.toUpperCase() === 'ACTIVE'
															? 'tw-bg-green-500 tw-text-white'
															: 'tw-bg-red-500 tw-text-white'
													} tw-cursor-default`}>
													{USER_DATA?.status}
												</div>
											</div>
										</div>
									) : null}

									{!editUser && !resetUserPassword ? (
										<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2 tw-py-3 tw-border-y">
											<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
												User Data
											</h2>

											<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2">
												<div className="tw-grid tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														First name
													</div>
													<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{USER_DATA?.first_name}
													</p>
												</div>
												<div className="tw-grid tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Last name
													</div>
													<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{USER_DATA?.last_name}
													</p>
												</div>
												<div className="tw-grid tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Email
													</div>
													<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{USER_DATA?.email}
													</p>
												</div>
												<div className="tw-grid tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Role
													</div>
													<p className="tw-w-full tw-capitalize tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{USER_DATA?.access}
													</p>
												</div>
												<div className="tw-grid tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
														Status
													</div>
													<p
														className={`tw-uppercase tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold ${
															USER_DATA?.status?.toUpperCase() === 'ACTIVE'
																? 'tw-text-green-500'
																: 'tw-text-red-500'
														}`}>
														{USER_DATA?.status}
													</p>
												</div>
											</div>
										</div>
									) : editUser ? (
										<div className="tw-w-full tw-flex tw-flex-col tw-space-y-6 tw-py-3 tw-border-t">
											<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
												Edit User
											</h2>
											<form onSubmit={handleEditUserSubmit(submitEditUserForm)}>
												<div className="tw-w-full tw-pb-3 tw-border-b">
													<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
														<Controller
															name={`first_name`}
															control={controlEditUser}
															defaultValue={USER_DATA?.first_name}
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
																	name={`first_name`}
																	helpertext={invalid ? error.message : null}
																	label="First Name"
																	type="text"
																	required
																/>
															)}
														/>
														<Controller
															name={`last_name`}
															control={controlEditUser}
															defaultValue={USER_DATA?.last_name}
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
																	name={`last_name`}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="Last Name"
																	type="text"
																	required
																/>
															)}
														/>

														<div className="tw-col-span-1 md:tw-col-span-2">
															<Controller
																name={`email`}
																control={controlEditUser}
																defaultValue={USER_DATA?.email}
																rules={{
																	required: 'Please enter email address',
																}}
																render={({
																	field: { ref, ...field },
																	fieldState: { error, invalid },
																}) => (
																	<DefaultInput
																		{...field}
																		ref={ref}
																		name={`email`}
																		error={invalid}
																		helpertext={invalid ? error.message : null}
																		label="Email"
																		type="email"
																		required
																		disabled
																	/>
																)}
															/>
														</div>

														<Controller
															name={`access`}
															control={controlEditUser}
															defaultValue={USER_DATA?.access}
															rules={{
																required: 'Please select role',
															}}
															render={({
																field: { ref, ...field },
																fieldState: { error, invalid },
															}) => (
																<SelectInput
																	{...field}
																	ref={ref}
																	name={`access`}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="Role"
																	options={[
																		{
																			name: 'admin',
																			value: 'admin',
																		},
																		{
																			name: 'staff',
																			value: 'staff',
																		},
																	]}
																	required
																/>
															)}
														/>

														<Controller
															name={`status`}
															control={controlEditUser}
															defaultValue={USER_DATA?.status}
															rules={{
																required: 'Please select status',
															}}
															render={({
																field: { ref, ...field },
																fieldState: { error, invalid },
															}) => (
																<SelectInput
																	{...field}
																	ref={ref}
																	name={`status`}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="Status"
																	options={[
																		{
																			name: 'active',
																			value: 'active',
																		},
																		{
																			name: 'inactive',
																			value: 'inactive',
																		},
																	]}
																	required
																/>
															)}
														/>
													</div>
												</div>
												<div className="tw-w-full tw-flex tw-justify-end tw-gap-10 tw-items-center tw-mt-6">
													<span
														className="btn-style-back red-light-color tw-w-fit tw-h-fit tw-rounded-lg tw-px-4 tw-py-2 tw-flex tw-shadow-md tw-justify-center tw-items-center tw-text-base tw-cursor-pointer"
														onClick={() => {
															setEditUser(false);
															resetEditUser();
														}}>
														Cancel
													</span>
													<button
														className="btn-style-one dark-green-color !tw-px-4 !tw-py-2"
														type="submit">
														Update
													</button>
												</div>
											</form>
										</div>
									) : resetUserPassword ? (
										<div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-space-y-2 tw-border-t tw-pt-5">
											<p>
												Are you sure you want to reset this users&apos;
												password?
											</p>

											<div className="tw-w-full tw-flex tw-justify-center tw-gap-5 tw-items-center">
												<span
													className="btn-style-back red-light-color tw-w-fit tw-h-fit tw-rounded-lg tw-px-4 tw-py-2 tw-flex tw-shadow-md tw-justify-center tw-items-center tw-text-base tw-cursor-pointer"
													onClick={() => {
														setResetUserPassword(false);
													}}>
													Cancel
												</span>
												<button
													//size="lg"
													className="btn-style-one dark-green-color !tw-px-4 !tw-py-2"
													//disabled={!isValid}
													onClick={() => {
														resetPasswordRequest({
															email: viewUserData?.email,
														});
														setResetUserPassword(false);
													}}
													type="button">
													Confirm
												</button>
											</div>
										</div>
									) : null}

									{!editUser && !resetUserPassword ? (
										<div className="tw-w-full tw-flex tw-justify-end tw-gap-5 tw-items-center">
											<span
												className="btn-style-back red-light-color tw-w-fit tw-h-fit tw-rounded-lg tw-px-4 tw-py-2 tw-flex tw-shadow-md tw-justify-center tw-items-center tw-text-base tw-cursor-pointer"
												onClick={() => {
													setResetUserPassword(true);
												}}>
												Reset password
											</span>
											<button
												//size="lg"
												className="btn-style-one dark-green-color !tw-px-4 !tw-py-2"
												//disabled={!isValid}
												onClick={() => setEditUser(true)}
												type="button">
												Edit user
											</button>
										</div>
									) : null}
								</div>
							) : (
								<div className="tw-w-full tw-h-fit tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
									<div className="tw-w-full tw-flex tw-justify-start tw-gap-4 tw-items-start">
										<div className="tw-h-full tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-5 tw-pt-3">
											<div className="tw-w-1/2 tw-flex tw-items-end tw-justify-start tw-gap-3">
												<Skeleton
													variant="text"
													sx={{ fontSize: '2rem', width: '35%' }}
												/>

												<Skeleton
													variant="text"
													sx={{ fontSize: '2rem', width: '15%' }}
												/>
											</div>
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '20%' }}
											/>
										</div>
									</div>

									<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2 tw-py-3 tw-border-y">
										<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
											User Data
										</h2>

										<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2">
											<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '20%' }}
												/>
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '35%' }}
												/>
											</div>
											<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '20%' }}
												/>
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '35%' }}
												/>
											</div>
											<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '20%' }}
												/>
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '35%' }}
												/>
											</div>
											<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '20%' }}
												/>
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '35%' }}
												/>
											</div>
											<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '20%' }}
												/>
												<Skeleton
													variant="text"
													sx={{ fontSize: '1rem', width: '35%' }}
												/>
											</div>
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

export default Users;
