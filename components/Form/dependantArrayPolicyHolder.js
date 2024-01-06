'use client';

import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import DefaultInput from '../Input/DefaultInput';
import SelectInput from '../Input/SelectInput';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MdDelete, MdVerified } from 'react-icons/md';
import { FormControl, FormHelperText, Tooltip } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { LuUserPlus, LuUsers } from 'react-icons/lu';
import { IoMdAdd } from 'react-icons/io';

const DependantArray = ({ control, watch, existingDependants = [] }) => {
	const [addExistingPrompt, setAddExistingPrompt] = useState(false);
	const [showAddExistingButton, setShowAddExistingButton] = useState(true);
	const [policyNumbersAddedToForm, setPolicyNumbersAddedToForm] = useState([]);

	const { fields, remove, append } = useFieldArray({
		control,
		name: 'insured_person.dependants',
	});

	const key = 'insured_person.dependants';

	const checkExistingDependantsInForm = () => {
		const existingDependantsPolicyNumbers = existingDependants?.map(
			(element) => element?.policy_number
		);
		const formDependantsPolicyNumbers = watch('insured_person.dependants')?.map(
			(element) => element?.policy_number
		);

		setPolicyNumbersAddedToForm(formDependantsPolicyNumbers);

		const containsAll = existingDependantsPolicyNumbers.every((element) => {
			return formDependantsPolicyNumbers.indexOf(element) !== -1;
		});

		setShowAddExistingButton(!containsAll);
	};

	useEffect(() => {
		checkExistingDependantsInForm();
	}, [watch('insured_person.dependants')]);

	return (
		<div className="tw-w-full tw-h-full tw-relative">
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
											disabled={
												watch(`${key}[${i}].policy_number`) !== 'new'
													? true
													: false
											}
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
											disabled={
												watch(`${key}[${i}].policy_number`) !== 'new'
													? true
													: false
											}
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
													disabled={
														watch(`${key}[${i}].policy_number`) !== 'new'
															? true
															: false
													}
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
											disabled={
												watch(`${key}[${i}].policy_number`) !== 'new'
													? true
													: false
											}
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
											disabled={
												watch(`${key}[${i}].policy_number`) !== 'new'
													? true
													: false
											}
										/>
									)}
								/>
							</div>
						</div>
					</div>
				);
			})}

			{addExistingPrompt && (
				<div
					onClick={() => setAddExistingPrompt(false)}
					className="tw-absolute tw-z-10 tw-top-0 tw-left-0 tw-w-full tw-h-full tw-flex tw-justify-center tw-items-end">
					<div
						onClick={(e) => e.stopPropagation()}
						className="tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-2xl tw-w-full md:tw-w-1/2 tw-h-fit tw-max-h-2/3">
						<div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
							{existingDependants?.map((existingDependant) => {
								if (
									policyNumbersAddedToForm.includes(
										existingDependant?.policy_number
									)
								) {
									return (
										<div
											key={existingDependant?.policy_number}
											className="tw-group tw-transition-all tw-duration-500 tw-ease-in-out tw-w-full tw-h-fit tw-rounded-lg tw-py-2 tw-px-5 tw-bg-gray-200 tw-flex tw-justify-center tw-items-center tw-gap-3 tw-cursor-not-allowed">
											<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
												<span className="tw-w-fit tw-text-base md:tw-text-lg tw-text-left tw-cursor-not-allowed">
													{existingDependant?.full_name}
												</span>
												<MdVerified className="tw-text-2xl tw-shrink-0 tw-cursor-not-allowed tw-text-green-500" />
											</div>
										</div>
									);
								} else {
									return (
										<Tooltip
											key={existingDependant?.policy_number}
											placement="top"
											title={`Add ${existingDependant?.full_name}`}>
											<div
												onClick={() => {
													append({
														first_name: existingDependant?.first_name,
														last_name: existingDependant?.last_name,
														email: existingDependant?.email,
														dob: existingDependant?.dob,
														gender: existingDependant?.gender,
														passport_number: existingDependant?.passport_number,
														telephone: existingDependant?.telephone,
														relationship_type:
															existingDependant?.relationship_type,
														policy_number: existingDependant?.policy_number,
													});

													setAddExistingPrompt(false);
												}}
												className="tw-group tw-transition-all tw-duration-500 tw-ease-in-out tw-w-full tw-h-fit tw-rounded-lg tw-py-2 tw-px-5 tw-border-2 tw-border-[#7862AF] hover:tw-bg-[#7862AF] tw-flex tw-justify-center tw-items-center tw-gap-3 tw-cursor-pointer">
												<div className="tw-w-full tw-flex tw-justify-between tw-items-center">
													<span className="tw-w-fit tw-text-base md:tw-text-lg tw-text-left tw-cursor-pointer group-hover:tw-text-white">
														{existingDependant?.full_name}
													</span>
													<IoMdAdd className="tw-text-2xl tw-shrink-0 tw-cursor-pointer group-hover:tw-text-white" />
												</div>
											</div>
										</Tooltip>
									);
								}
							})}

							<div className="tw-w-full tw-flex tw-justify-end tw-items-center">
								<span
									className="tw-transition-all tw-duration-300 tw-ease-in-out tw-px-4 tw-py-2 tw-capitalize tw-rounded-lg tw-bg-red-500 tw-text-white tw-cursor-pointer hover:tw-shadow-md hover:tw-font-medium"
									onClick={() => setAddExistingPrompt(false)}>
									Cancel
								</span>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="tw-w-full tw-flex tw-justify-end tw-items-start tw-mt-5">
				<div className="tw-w-fit tw-flex tw-justify-center tw-items-center tw-gap-5 lg:tw-gap-10 tw-mb-5">
					{showAddExistingButton ? (
						<div
							onClick={() => setAddExistingPrompt(true)}
							className="tw-cursor-pointer tw-transition-all tw-duration-200 tw-ease-in-out tw-p-4 tw-rounded-lg tw-group hover:tw-shadow-md hover:tw-bg-[#7862AF] hover:tw-text-white tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
							<LuUsers className="tw-text-2xl lg:tw-text-4xl tw-shrink-0" />

							<span className="tw-capitalize tw-text-center tw-text-sm">
								Add existing <br className="xl:tw-hidden" /> dependant
							</span>
						</div>
					) : null}

					<div
						onClick={() =>
							append({
								first_name: '',
								last_name: '',
								email: '',
								dob: '',
								gender: '',
								passport_number: '',
								telephone: '',
								relationship_type: '',
								policy_number: 'new',
							})
						}
						className="tw-cursor-pointer tw-transition-all tw-duration-200 tw-ease-in-out tw-p-4 tw-rounded-lg tw-group hover:tw-shadow-md hover:tw-bg-[#7862AF] hover:tw-text-white tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
						<LuUserPlus className="tw-text-2xl lg:tw-text-4xl tw-shrink-0" />

						<span className="tw-capitalize tw-text-center tw-text-sm">
							Add new <br className="xl:tw-hidden" /> dependant
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DependantArray;
