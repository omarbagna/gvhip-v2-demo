import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import DefaultInput from '../Input/DefaultInput';
import SelectInput from '../Input/SelectInput';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MdDelete } from 'react-icons/md';
import { IoAdd } from 'react-icons/io5';
import { FormControl, FormHelperText } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

const DependantArray = ({ nestIndex = null, control, watch }) => {
	const { fields, remove, append } = useFieldArray({
		control,
		name:
			nestIndex !== null
				? `insured_person.${nestIndex}.dependants`
				: 'insured_person.dependants',
	});

	const key =
		nestIndex !== null
			? `insured_person.${nestIndex}.dependants`
			: 'insured_person.dependants';

	return (
		<div className="tw-w-full tw-h-full">
			{fields.map((dependantField, i) => {
				return (
					<div key={i} className="tw-w-full tw-h-full">
						<div
							key={dependantField.id}
							className="tw-w-full tw-h-fit tw-p-2 tw-gap-10 tw-flex tw-flex-col tw-justify-start tw-items-start tw-border-b-2 tw-border-[#171e41] tw-py-5">
							<div className="tw-w-full tw-flex tw-flex-col md:tw-flex-row tw-gap-2 tw-justify-start tw-items-start md:tw-justify-between md:tw-items-center">
								<h4 className="tw-w-fit tw-text-tw-left tw-font-title tw-font-medium tw-text-xl tw-text-[#7862AF]">
									{watch(`${key}[${i}].relationship_type`)
										? watch(`${key}[${i}].relationship_type`)
										: 'Dependant'}{' '}
									Details
								</h4>

								<div
									onClick={() => remove(i)}
									className="tw-group tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-gap-1">
									<span className="tw-text-lg tw-flex tw-justify-center tw-items-center tw-bg-transparent tw-transition-all tw-duration-500 tw-ease-in-out group-hover:tw-shadow-lg group-hover:tw-shadow-red-400/50 tw-rounded-full group-hover:tw-bg-red-500 tw-text-red-500 group-hover:tw-text-white tw-h-6 tw-w-6">
										<MdDelete />
									</span>{' '}
									<p className="tw-text-red-500 tw-text-base">Remove</p>
								</div>
							</div>

							<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
								<Controller
									name={`${key}[${i}].first_name`}
									control={control}
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
											name={`${key}[${i}].first_name`}
											error={invalid}
											helpertext={invalid ? error.message : null}
											label="First Name"
											type="text"
											required
										/>
									)}
								/>
								<Controller
									name={`${key}[${i}].last_name`}
									control={control}
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
											name={`${key}[${i}].last_name`}
											error={invalid}
											helpertext={invalid ? error.message : null}
											label="Last Name"
											type="text"
											required
										/>
									)}
								/>
							</div>

							<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
								<Controller
									name={`${key}[${i}].email`}
									control={control}
									defaultValue={''}
									rules={{
										pattern: {
											value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/gi,
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
											name={`${key}[${i}].email`}
											error={invalid}
											helpertext={invalid ? error.message : null}
											label="Email"
											type="email"
											required
										/>
									)}
								/>
								<Controller
									name={`${key}[${i}].telephone`}
									control={control}
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
												name={`${key}[${i}].telephone`}
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
												excludeCountries={['gh']}
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

							<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
								<Controller
									name={`${key}[${i}].dob`}
									control={control}
									defaultValue={''}
									rules={{
										required: 'Please specify date of birth',
									}}
									render={({
										field: { value, onChange, ref, ...field },
										fieldState: { error, invalid },
									}) => (
										<FormControl error={invalid}>
											<LocalizationProvider dateAdapter={AdapterDateFns}>
												<DatePicker
													{...field}
													ref={ref}
													name={`${key}[${i}].dob`}
													maxDate={new Date()}
													value={new Date(value)}
													onChange={(value) => {
														if (value !== null) {
															onChange(dayjs(value).format('YYYY-MM-DD'));
														} else {
															onChange('');
														}
													}}
													label="Date of Birth"
													format="dd/MM/yyyy"
												/>
											</LocalizationProvider>
											<FormHelperText>
												{invalid ? error.message : null}
											</FormHelperText>
										</FormControl>
									)}
								/>

								<Controller
									name={`${key}[${i}].gender`}
									control={control}
									defaultValue={''}
									rules={{
										required: 'Please select gender',
									}}
									render={({
										field: { ref, ...field },
										fieldState: { error, invalid },
									}) => (
										<SelectInput
											{...field}
											ref={ref}
											name={`${key}[${i}].gender`}
											error={invalid}
											helpertext={invalid ? error.message : null}
											label="Gender"
											options={[
												{
													name: 'Male',
													value: 'Male',
												},
												{
													name: 'Female',
													value: 'Female',
												},
											]}
											required
										/>
									)}
								/>
							</div>

							<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-5">
								<Controller
									name={`${key}[${i}].passport_number`}
									control={control}
									defaultValue={''}
									rules={{
										required: 'Please enter passport number',
									}}
									render={({
										field: { ref, ...field },
										fieldState: { error, invalid },
									}) => (
										<DefaultInput
											{...field}
											ref={ref}
											name={`${key}[${i}].passport_number`}
											error={invalid}
											helpertext={invalid ? error.message : null}
											label="Passport Number"
											type="text"
											required
										/>
									)}
								/>

								<Controller
									name={`${key}[${i}].relationship_type`}
									control={control}
									defaultValue={''}
									rules={{
										required: 'Please select relationship type',
									}}
									render={({
										field: { ref, ...field },
										fieldState: { error, invalid },
									}) => (
										<SelectInput
											{...field}
											ref={ref}
											name={`${key}[${i}].relationship_type`}
											error={invalid}
											helpertext={invalid ? error.message : null}
											label="Relationship Type"
											options={[
												{
													name: 'Spouse',
													value: 'Spouse',
												},
												{
													name: 'Child',
													value: 'Child',
												},
											]}
											required
										/>
									)}
								/>
							</div>
						</div>
					</div>
				);
			})}

			<div className="tw-w-full tw-flex tw-justify-end tw-items-start tw-mt-5">
				<div>
					<div
						onClick={() =>
							append({
								first_name: '',
								last_name: '',
								dob: '',
								gender: '',
								passport_number: '',
								relationship_type: '',
							})
						}
						className="tw-group tw-cursor-pointer tw-w-fit tw-flex tw-justify-start tw-items-center tw-gap-2">
						<div className="tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-6 tw-w-6 tw-text-white tw-bg-[#8e6abf] group-hover:tw-shadow-lg group-hover:tw-shadow-[#8e6abf]/50">
							<IoAdd className="tw-text-base" />
						</div>
						<p className="tw-font-bold tw-text-sm tw-text-[#8e6abf]">
							Add Dependant
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DependantArray;
