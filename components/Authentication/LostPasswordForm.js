// import baseUrl from '@/utils/baseUrl';
import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

const LostPasswordForm = () => {
	const { control, handleSubmit, reset } = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			policy_number: '',
		},
	});

	const isValidEmail = (email) => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	const triggerPasswordReset = async (data) => {
		const url = `/api/send-reset-link`;

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

					reset();
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
					render: error?.message,
					type: 'error',
					isLoading: false,
					autoClose: 4500,
				});
			},
		}
	);

	const resetPasswordRequest = (data) => {
		const isEmail = isValidEmail(data?.policy_number);

		const passwordResetData = isEmail ? { email: data.policy_number } : data;

		resetPassword.mutate(passwordResetData);
	};

	return (
		<>
			<div className="profile-authentication-area ptb-100">
				<div className="container">
					<div className="lost-password-box">
						<p>
							Lost your password? Please enter your policy number or email. You
							will receive a link to create a new password via email.
						</p>
						<form onSubmit={handleSubmit(resetPasswordRequest)}>
							<Controller
								control={control}
								name={`policy_number`}
								defaultValue={''}
								rules={{
									/*
									pattern: {
										value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/gi,
										message: 'Please enter a valid email address',
									},
									*/
									required: 'Please enter your policy number',
								}}
								render={({
									field: { ref, ...field },
									fieldState: { error, invalid },
								}) => (
									<div className="form-group">
										<label>Policy number or Email</label>
										<input
											{...field}
											ref={ref}
											type="text"
											className="form-control"
										/>
										{invalid && (
											<p className="tw-text-xs tw-text-red-400">
												{error.message}
											</p>
										)}
									</div>
								)}
							/>
							<button type="submit">Reset Password</button>
						</form>
					</div>
				</div>
			</div>

			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={resetPassword.isLoading}>
				<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
					<CircularProgress color="inherit" />
					<p className="tw-text-white tw-font-medium tw-text-center tw-text-lg tw-w-2/3">
						Sending reset link, please wait...
					</p>
				</div>
			</Backdrop>
		</>
	);
};

export default LostPasswordForm;
