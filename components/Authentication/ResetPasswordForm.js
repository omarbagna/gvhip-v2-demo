'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import DefaultInput from '../Input/DefaultInput';
import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
// import baseUrl from '@/utils/baseUrl';
import axios from 'axios';

const ResetPasswordForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { control, watch, reset, handleSubmit } = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			new_password: '',
			confirm_password: '',
		},
	});
	const router = useRouter();

	const resetParams = router.query;

	const triggerPasswordReset = async (data) => {
		const url = `/api/reset-password`;

		toast.loading('Resetting password', {
			toastId: 'resettingPassword',
		});
		const { data: response } = await axios.post(url, data);
		return response;
	};

	const resetPasswordRequest = useMutation(
		(newPasswordData) => triggerPasswordReset(newPasswordData),
		{
			onSuccess: (data) => {
				if (data?.status === 200) {
					//window.location.replace(data.redirect_url);
					toast.update('resettingPassword', {
						render: 'Password changed successfully',
						type: 'success',
						isLoading: false,
						autoClose: 3500,
					});

					reset();
					router.push('/authentication');
				} else if (data?.status !== 200) {
					toast.update('resettingPassword', {
						render: 'Password reset failed',
						type: 'error',
						isLoading: false,
						autoClose: 3500,
					});
				}
			},
			onError: (error) => {
				console.log(error);
				toast.update('resettingPassword', {
					render: error?.message,
					type: 'error',
					isLoading: false,
					autoClose: 3500,
				});
			},
		}
	);

	const resetPassword = async (data) => {
		const resetData = resetParams?.email
			? {
					email: resetParams?.email,
					token: resetParams?.token,
					password: data.new_password,
					password_confirmation: data.confirm_password,
			  }
			: resetParams?.policy_number && {
					token: resetParams?.token,
					policy_number: resetParams?.policy_number,
					password: data.new_password,
					password_confirmation: data.confirm_password,
			  };
		resetPasswordRequest.mutate(resetData);
	};

	return (
		<>
			<div className="col-lg-6 col-md-12">
				<div className="login-form">
					<form onSubmit={handleSubmit(resetPassword)}>
						<div className="tw-w-full tw-flex tw-flex-col tw-gap-5">
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
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													{!showPassword ? (
														<Tooltip title="Show password">
															<IconButton
																aria-label="toggle show password"
																onClick={() => setShowPassword(true)}
																edge="end">
																<BsEyeFill />
															</IconButton>
														</Tooltip>
													) : (
														<Tooltip title="Hide password">
															<IconButton
																aria-label="toggle show password"
																onClick={() => setShowPassword(false)}
																edge="end">
																<BsEyeSlashFill />
															</IconButton>
														</Tooltip>
													)}
												</InputAdornment>
											),
										}}
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
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													{!showPassword ? (
														<Tooltip title="Show password">
															<IconButton
																aria-label="toggle show password"
																onClick={() => setShowPassword(true)}
																edge="end">
																<BsEyeFill />
															</IconButton>
														</Tooltip>
													) : (
														<Tooltip title="Hide password">
															<IconButton
																aria-label="toggle show password"
																onClick={() => setShowPassword(false)}
																edge="end">
																<BsEyeSlashFill />
															</IconButton>
														</Tooltip>
													)}
												</InputAdornment>
											),
										}}
									/>
								)}
							/>
						</div>

						<button className="form-btn" type="submit">
							Reset
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default ResetPasswordForm;
