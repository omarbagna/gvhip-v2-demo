import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'pages/api/axios';
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

	const triggerPasswordReset = async (data) => {
		toast.loading('Sending reset link', {
			toastId: 'sendingLink',
		});
		const { data: response } = await axios.post(
			'/send-password-reset-link',
			data
		);
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
		resetPassword.mutate(data);
	};

	return (
		<>
			<div className="profile-authentication-area ptb-100">
				<div className="container">
					<div className="lost-password-box">
						<p>
							Lost your password? Please enter your policy number. You will
							receive a link to create a new password via email.
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
										<label>Policy number</label>
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
