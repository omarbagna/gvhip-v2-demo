'use client';

import React from 'react';
import { TextField } from '@mui/material';

const DefaultInput = (props, ref) => {
	const { onChange, name, type, helpertext, error } = props;

	return (
		<>
			{type === 'text-area' ? (
				<div className="tw-flex tw-flex-col tw-gap-1 tw-w-full tw-justify-start tw-items-start">
					<TextField
						{...props}
						name={name}
						ref={ref}
						error={error}
						onChange={onChange}
						multiline
						rows={4}
						helperText={helpertext}
						variant="outlined"
						//size="lg"
						fullWidth
					/>
					{/*error && (
						<Typography className="text-xs text-red-400">
							{helpertext}
						</Typography>
					)*/}
				</div>
			) : (
				<div className="tw-flex tw-flex-col tw-gap-1 tw-w-full tw-justify-start tw-items-start">
					<TextField
						{...props}
						name={name}
						ref={ref}
						type={type}
						error={error}
						onChange={onChange}
						helperText={helpertext}
						variant="outlined"
						size="large"
						fullWidth
					/>
					{/*error && (
						<Typography className="text-xs text-red-400">
							{helpertext}
						</Typography>
					)*/}
				</div>
			)}
		</>
	);
};

export default React.forwardRef(DefaultInput);
