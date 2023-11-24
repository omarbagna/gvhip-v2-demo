'use client';

import React, { useState } from 'react';
import DashboardNav from '@/components/Layout/Navigations/DashboardNav';
import { Chip, Skeleton, Stack } from '@mui/material';
import { useQuery } from 'react-query';

import useAxiosAuth from 'hooks/useAxiosAuth';
import UsersTable from '@/components/Table/UsersTable';
import { useStateContext } from 'context/StateContext';
import { AiOutlineClose } from 'react-icons/ai';
import { Controller, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import DefaultInput from '@/components/Input/DefaultInput';
import SelectInput from '@/components/Input/SelectInput';

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
		accessor: 'role',
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

const dummyData = [
	{
		first_name: 'John',
		last_name: 'Mbir',
		email: 'jmbir@rxhealthinfosystems.com',
		role: 'admin',
		status: 'active',
	},
	{
		first_name: 'Bagna',
		last_name: 'Omar',
		email: 'bagna@rxhealthinfosystems.com',
		role: 'user',
		status: 'inactive',
	},
	{
		first_name: 'Favour',
		last_name: 'Nwevo',
		email: 'favour@rxhealthinfosystems.com',
		role: 'user',
		status: 'active',
	},
];

const Users = () => {
	const { data: session, status } = useSession();
	const axiosPrivate = useAxiosAuth();
	const { viewUser, setViewUser, viewUserData, setViewUserData } =
		useStateContext();

	const [filter, setFilter] = useState('this_year');
	const [addNewUser, setAddNewUser] = useState(false);
	const [editUser, setEditUser] = useState(false);

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

	const submitNewUserForm = (data) => {
		console.log(data);
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

	const submitEditUserForm = (data) => {
		console.log(data);
	};

	const getStatisticsData = async (filter = 'this_year') => {
		const response = await axiosPrivate.get(
			`/admin/statistics?filter=${filter}`
		);

		return response;
	};

	const statisticsData = useQuery(
		['stats', filter],
		() => getStatisticsData(filter),
		{
			onError: (error) => {
				console.log(error);
				/*
				if (error?.data?.message?.toLowercase() === 'unauthenticated.') {
					toast.error('Session expired');
					return await signOut({ callbackUrl: '/' });
				}
				*/
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
					<h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold">Users</h2>

					{statisticsData.isLoading ? (
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

				{!statisticsData.isLoading && STATISTICS_DATA && (
					<>
						<UsersTable COLUMNS={columns} DATA={dummyData} />
					</>
				)}

				{statisticsData.isLoading && (
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

				{!statisticsData.isLoading && !STATISTICS_DATA && (
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

												<div className="tw-col-span-1 lg:tw-col-span-2">
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
												</div>

												<Controller
													name={`role`}
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
															name={`role`}
															error={invalid}
															helpertext={invalid ? error.message : null}
															label="Role"
															options={[
																{
																	name: 'admin',
																	value: 'admin',
																},
																{
																	name: 'user',
																	value: 'user',
																},
															]}
															required
														/>
													)}
												/>

												<Controller
													name={`status`}
													control={controlNewUser}
													defaultValue={''}
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
							{viewUserData && (
								<div className="tw-w-full tw-h-fit tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
									{!editUser ? (
										<div className="tw-w-full tw-flex tw-justify-start tw-gap-4 tw-items-start">
											<div className="tw-h-full tw-w-full tw-flex tw-justify-between tw-items-center tw-gap-5 tw-pt-3">
												<div className="tw-flex tw-items-end tw-justify-start tw-gap-3">
													<h3 className="tw-font-semibold tw-text-lg md:tw-text-xl tw-text-[#8e6abf]">
														{viewUserData?.first_name} {viewUserData?.last_name}
													</h3>

													<span
														className={`tw-group tw-transition-all tw-capitalize tw-text-xs tw-duration-200 tw-ease-in-out tw-p-1 tw-px-2 tw-rounded-md hover:tw-bg-[#8D69BF] hover:tw-text-white tw-bg-[#FFECF4] tw-text-[#8D69BF] tw-cursor-default`}>
														{viewUserData?.role}
													</span>
												</div>
												<div
													className={`tw-group tw-transition-all tw-capitalize tw-text-sm tw-duration-200 tw-ease-in-out tw-p-1 tw-px-2 tw-rounded-full ${
														viewUserData?.status?.toUpperCase() === 'ACTIVE'
															? 'tw-bg-green-500 tw-text-white'
															: 'tw-bg-red-500 tw-text-white'
													} tw-cursor-default`}>
													{viewUserData?.status}
												</div>
											</div>
										</div>
									) : null}

									{!editUser ? (
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
														{viewUserData?.first_name}
													</p>
												</div>
												<div className="tw-grid tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Last name
													</div>
													<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{viewUserData?.last_name}
													</p>
												</div>
												<div className="tw-grid tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Email
													</div>
													<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{viewUserData?.email}
													</p>
												</div>
												<div className="tw-grid tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
														Role
													</div>
													<p className="tw-w-full tw-capitalize tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
														{viewUserData?.role}
													</p>
												</div>
												<div className="tw-grid tw-grid-cols-2">
													<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
														Status
													</div>
													<p
														className={`tw-uppercase tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold ${
															viewUserData?.status?.toUpperCase() === 'ACTIVE'
																? 'tw-text-green-500'
																: 'tw-text-red-500'
														}`}>
														{viewUserData?.status}
													</p>
												</div>
											</div>
										</div>
									) : (
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
															defaultValue={viewUserData?.first_name}
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
															defaultValue={viewUserData?.last_name}
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
																defaultValue={viewUserData?.email}
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
															name={`role`}
															control={controlEditUser}
															defaultValue={viewUserData?.role}
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
																	name={`role`}
																	error={invalid}
																	helpertext={invalid ? error.message : null}
																	label="Role"
																	options={[
																		{
																			name: 'admin',
																			value: 'admin',
																		},
																		{
																			name: 'user',
																			value: 'user',
																		},
																	]}
																	required
																/>
															)}
														/>

														<Controller
															name={`status`}
															control={controlEditUser}
															defaultValue={viewUserData?.status}
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
									)}
									{!editUser ? (
										<div className="tw-w-full tw-flex tw-justify-end tw-gap-3 tw-items-center">
											<button
												//size="lg"
												className="btn-style-one dark-green-color !tw-px-4 !tw-py-2"
												//disabled={!isValid}
												onClick={() => setEditUser(true)}
												type="button">
												Edit
											</button>
										</div>
									) : null}
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
