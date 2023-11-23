'use client';

import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const SelectInput = (props, ref) => {
	const { options, onChange, value, helpertext, error } = props;

	return (
		<div className="tw-w-full">
			<TextField
				{...props}
				ref={ref}
				variant="outlined"
				value={value}
				//size="small"
				select
				fullWidth
				className="tw-capitalize"
				helperText={helpertext}
				error={error}
				onChange={onChange}>
				{options?.map(({ name, value, disabled }, index) => (
					<MenuItem
						key={index}
						value={!value ? name : value}
						disabled={disabled ? disabled : false}
						className="tw-capitalize">
						{name}
					</MenuItem>
				))}
			</TextField>
			{/*error && helpertext && (
				<Typography className="text-xs text-red-400">{helpertext}</Typography>
			)*/}
		</div>
	);
};

export default React.forwardRef(SelectInput);
