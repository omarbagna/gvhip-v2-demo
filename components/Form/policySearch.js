'use client';

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import SelectInput from '../Input/SelectInput';
import DefaultInput from '../Input/DefaultInput';
import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import { BiQrScan } from 'react-icons/bi';
import { Html5QrcodeScanner } from 'html5-qrcode';

const PolicySearch = ({
	submitSearchRequest,
	showScanner,
	setShowScanner,
	policyFound,
}) => {
	const [triggerScanSearch, setTriggerScanSearch] = useState(false);

	const { reset, control, handleSubmit, setValue } = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			search_term: '',
			search_type: 'policy_number',
		},
	});

	const handleShowScanner = () => {
		setShowScanner((prev) => !prev);
	};

	useEffect(() => {
		if (policyFound) {
			reset();
		}
	}, [policyFound, reset]);

	useEffect(() => {
		if (showScanner) {
			var html5QrcodeScanner = new Html5QrcodeScanner('reader', {
				fps: 10,
				qrbox: 300,
				rememberLastUsedCamera: true,
			});

			function onScanSuccess(decodedText, decodedResult) {
				// Handle on success condition with the decoded text or result.
				html5QrcodeScanner.clear();
				// ^ this will stop the scanner (video feed) and clear the scan area.
				if (decodedText) {
					setValue(`search_term`, decodedText);
				}
				// ...
				setTriggerScanSearch(true);
				setShowScanner(false);
			}

			html5QrcodeScanner.render(onScanSuccess);
		}

		if (triggerScanSearch) {
			document.getElementById('search-policy-button').click();
			setTriggerScanSearch(false);
		}
	}, [showScanner, setValue, triggerScanSearch]);

	return (
		<>
			<form onSubmit={handleSubmit(submitSearchRequest)}>
				<div className="tw-w-full tw-flex tw-flex-col md:tw-flex-row tw-justify-end tw-items-start tw-gap-3">
					<div className="tw-w-full md:tw-w-1/4">
						<Controller
							control={control}
							name={'search_type'}
							rules={{
								required: 'Please select search type',
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
									label="Search by"
									options={[
										{
											name: 'passport number',
											value: 'passport_number',
										},
										{ name: 'policy number', value: 'policy_number' },
									]}
									required
								/>
							)}
						/>
					</div>

					<Controller
						name={'search_term'}
						control={control}
						rules={{
							required:
								'Please enter passport number or policy number to search',
						}}
						render={({
							field: { ref, ...field },
							fieldState: { error, invalid },
						}) => (
							<DefaultInput
								{...field}
								id="search_term"
								ref={ref}
								error={invalid}
								helpertext={invalid ? error.message : null}
								label="Passport Number/ Policy Number"
								type="text"
								autoFocus
								required
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Tooltip title="Scan QR Code">
												<IconButton
													aria-label="toggle scan code"
													onClick={() => handleShowScanner()}
													edge="end">
													<BiQrScan />
												</IconButton>
											</Tooltip>
										</InputAdornment>
									),
								}}
							/>
						)}
					/>

					<button
						id="search-policy-button"
						className="btn-style-one dark-green-color"
						type="submit">
						Search
					</button>
				</div>
			</form>
		</>
	);
};

export default PolicySearch;
