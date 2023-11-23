'use client';

import React, { useState } from 'react';
import Navbar4 from '@/components/Layout/Navigations/Navbar4';
import FooterFour from '@/components/Layout/Footer/FooterFour';
import { useMutation } from 'react-query';
import axios from 'pages/api/axios';
import { IconButton, Skeleton, Stack } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { IoClose } from 'react-icons/io5';
import dayjs from 'dayjs';
import { differenceInDays } from 'date-fns';
import PolicySearch from '@/components/Form/policySearch';
import BlurImage from '@/components/BlurImage/BlurImage';
const MySwal = withReactContent(Swal);

const alert = (title = null, text = null, icon = null) => {
	MySwal.fire({
		title: title,
		text: text,
		icon: icon,
		timer: 8000,
		timerProgressBar: true,
		showConfirmButton: false,
	});
};

const FindPolicy = () => {
	const [policyHolder, setPolicyHolder] = useState(null);
	const [policyFound, setPolicyFound] = useState(false);
	const [notFound, setNotFound] = useState(false);
	const [showScanner, setShowScanner] = useState(false);

	const handleCloseScanner = () => {
		document.getElementById('html5-qrcode-button-camera-stop').click();
		setTimeout(() => {
			setShowScanner(false);
		}, 1000);
	};

	// Search for a Policy Holder
	const searchPolicy = async (data) => {
		const { data: response } = await axios.get(
			`/search-user?search_type=${data?.search_type}&search_term=${data?.search_term}`
		);
		return response;
	};

	const findPolicy = useMutation((searchData) => searchPolicy(searchData), {
		onSuccess: (data) => {
			if (data?.status === 'success') {
				setNotFound(false);
				setPolicyHolder(data?.user);
				setPolicyFound(true);
			} else if (data?.status !== 'success') {
				alert('User not found', null, 'error');
				setNotFound(true);
				setPolicyFound(false);
				setPolicyHolder(null);
			}
		},
		onError: (error) => {
			alert('User not found', null, 'error');
			setNotFound(true);
			setPolicyFound(false);
			setPolicyHolder(null);
		},
	});

	const submitSearchRequest = (data) => {
		setPolicyHolder(null);
		setNotFound(false);
		const searchData = data;

		findPolicy.mutate(searchData);
	};

	return (
		<>
			<Navbar4 />
			<div className="tw-w-full tw-min-h-screen tw-bg-[#FEFBFB] tw-py-20 ">
				<div className="tw-w-full tw-h-full tw-py-10 tw-px-6 md:tw-px-12 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-10 tw-overflow-hidden">
					<div className="tw-w-full tw-flex tw-flex-col xl:tw-flex-row tw-justify-start tw-items-start xl:tw-justify-between xl:tw-items-center tw-gap-5">
						<h2 className="tw-text-2xl md:tw-text-3xl tw-font-semibold tw-shrink-0">
							Find Policy
						</h2>
						<div className="tw-w-full xl:tw-w-2/3">
							<PolicySearch
								{...{
									submitSearchRequest,
									showScanner,
									setShowScanner,
									policyFound,
								}}
							/>
						</div>
					</div>

					{/* Show Policy Holder Information and verification status */}
					{policyHolder && (
						<div className="tw-w-full tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 xl:tw-grid-cols-2 tw-gap-5 tw-place-content-start tw-place-items-start">
							<div className="tw-w-full tw-h-fit lg:tw-col-span-2 xl:tw-col-span-1  tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
								<div className="tw-w-full tw-h-fit tw-bg-white tw-shadow-sm tw-rounded-lg tw-py-5 tw-px-8 tw-flex tw-flex-col tw-justify-center tw-items-start tw-gap-5">
									<div className="tw-w-full tw-flex tw-justify-start tw-gap-4 tw-items-start">
										<BlurImage
											src={policyHolder?.travelling_info?.policy_qr_code}
											alt="qr code"
											height={120}
											width={120}
										/>
										<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1 tw-pt-3">
											<h3 className="tw-font-semibold tw-text-lg md:tw-text-xl tw-text-[#8e6abf]">
												{policyHolder?.insured_person?.length > 0
													? policyHolder?.insured_person[0]?.first_name
													: policyHolder?.travelling_info?.first_name}{' '}
												{policyHolder?.insured_person?.length > 0
													? policyHolder?.insured_person[0]?.last_name
													: policyHolder?.travelling_info?.last_name}
											</h3>
											<div className="tw-w-full tw-flex tw-justify-start tw-items-end tw-gap-3">
												<div className="tw-w-fit tw-shrink-0 tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
													Passport number:
												</div>
												<p className="tw-uppercase tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600 tw-font-bold">
													{policyHolder?.insured_person?.length > 0
														? policyHolder?.insured_person[0]?.passport_number
														: policyHolder?.travelling_info?.passport_number}
												</p>
											</div>
											<div className="tw-w-full tw-flex tw-justify-start tw-items-end tw-gap-3">
												<div className="tw-w-fit tw-shrink-0 tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
													Policy number:
												</div>
												<p className="tw-uppercase tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600 tw-font-bold">
													{policyHolder?.travelling_info?.policy_number}
												</p>
											</div>
											{/*<div className="tw-w-full tw-flex tw-justify-start tw-items-end tw-gap-3">
										<div className="tw-w-fit tw-shrink-0 tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
											Policy Status:
										</div>
										<p className="tw-capitalize tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-600 tw-font-bold">
											Active
										</p>
									</div>*/}
										</div>
									</div>
									<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2 tw-py-3 tw-border-t">
										<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
											Bio Data
										</h2>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												First name
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{policyHolder?.insured_person?.length > 0
													? policyHolder?.insured_person[0]?.first_name
													: policyHolder?.travelling_info?.first_name}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												Last name
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{policyHolder?.insured_person?.length > 0
													? policyHolder?.insured_person[0]?.last_name
													: policyHolder?.travelling_info?.last_name}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												Date of Birth
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{dayjs(
													policyHolder?.insured_person?.length > 0
														? policyHolder?.insured_person[0]?.dob
														: policyHolder?.travelling_info?.dob
												).format('MMM DD, YYYY')}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												Gender
											</div>
											<p className="tw-w-full tw-capitalize tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{policyHolder?.insured_person?.length > 0
													? policyHolder?.insured_person[0]?.gender
													: policyHolder?.travelling_info?.gender}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
												Passport Number
											</div>
											<p className="tw-uppercase tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{policyHolder?.insured_person?.length > 0
													? policyHolder?.insured_person[0]?.passport_number
													: policyHolder?.travelling_info?.passport_number}
											</p>
										</div>
									</div>
									<div className="tw-w-full tw-flex tw-flex-col tw-space-y-2 tw-py-3 tw-border-y">
										<h2 className="tw-w-full tw-font-title tw-font-medium tw-text-base tw-text-gray-600 tw-flex tw-justify-start tw-items-end">
											Travel details
										</h2>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												Country of Origin
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{policyHolder?.insured_person?.length > 0
													? policyHolder?.insured_person[0]?.country
													: policyHolder?.travelling_info?.country}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												Effective Date
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{dayjs(
													policyHolder?.travelling_info
														?.user_policy_transaction[0]?.start_date
												).format('MMM DD, YYYY')}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-text-gray-500">
												Expiry Date
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{dayjs(
													policyHolder?.travelling_info
														?.user_policy_transaction[0]?.end_date
												).format('MMM DD, YYYY')}
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
												Duration
											</div>
											<p className="tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-gray-600 tw-font-bold">
												{
													policyHolder?.travelling_info
														?.user_policy_transaction[0]?.duration
												}{' '}
												Days
											</p>
										</div>
									</div>
									<div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
												Policy Name
											</div>
											<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-sm tw-text-[#8e6abf] tw-font-bold">
												{
													policyHolder?.travelling_info
														?.user_policy_transaction[0]?.travel_plan?.plan_name
												}
											</span>
										</div>
										{policyHolder?.travelling_info?.user_policy_transaction[0]
											?.extension_start_date ? (
											<div className="tw-grid tw-grid-cols-2">
												<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
													Extension status
												</div>
												<p className="tw-capitalize tw-w-full tw-flex tw-justify-end tw-text-sm tw-text-green-500 tw-font-bold">
													Extended
												</p>
											</div>
										) : null}
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-500">
												Expires in
											</div>
											<p
												className={`tw-capitalize tw-w-full tw-flex tw-justify-end tw-text-base ${
													Number(
														differenceInDays(
															new Date(
																policyHolder?.travelling_info
																	?.user_policy_transaction[0]
																	?.extension_end_date
																	? policyHolder?.travelling_info
																			?.user_policy_transaction[0]
																			?.extension_end_date
																	: policyHolder?.travelling_info
																			?.user_policy_transaction[0]?.end_date
															),
															new Date()
														)
													) +
														2 >
													5
														? 'tw-text-green-500'
														: 'tw-text-red-500'
												}  tw-font-bold`}>
												{Number(
													differenceInDays(
														new Date(
															policyHolder?.travelling_info
																?.user_policy_transaction[0]?.extension_end_date
																? policyHolder?.travelling_info
																		?.user_policy_transaction[0]
																		?.extension_end_date
																: policyHolder?.travelling_info
																		?.user_policy_transaction[0]?.end_date
														),
														new Date()
													)
												) + 1}{' '}
												days
											</p>
										</div>
										<div className="tw-grid tw-grid-cols-2">
											<div className="tw-w-full tw-flex tw-justify-start tw-text-sm tw-font-semibold tw-text-gray-500">
												Price
											</div>
											<span className="tw-w-full tw-flex tw-justify-end tw-items-end tw-gap-1 tw-text-xl tw-text-[#8e6abf] tw-font-bold">
												{Intl.NumberFormat('en-US', {
													style: 'currency',
													currency: 'USD',
												}).format(
													policyHolder?.travelling_info
														?.user_policy_transaction[0]?.price
												)}{' '}
											</span>
										</div>
									</div>
								</div>
							</div>

							{policyHolder?.travelling_info?.user_policy_transaction[0]
								?.status !== 'pending' ? (
								<div className="tw-w-full tw-flex-col tw-justify-start tw-items-start tw-gap-3">
									<div className="tw-bg-[#7862AF]/20 tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-2 tw-h-fit tw-p-3 tw-rounded-lg">
										<div className="tw-w-full tw-grid tw-grid-cols-2 tw-gap-1">
											<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-600">
												Authorization status
											</div>
											<p
												className={`tw-w-full tw-uppercase tw-flex tw-justify-end tw-text-base ${
													policyHolder?.travelling_info
														?.user_policy_transaction[0]?.status === 'verified'
														? 'tw-text-green-600'
														: 'tw-text-red-600'
												}  tw-font-bold`}>
												{
													policyHolder?.travelling_info
														?.user_policy_transaction[0]?.status
												}
											</p>
										</div>
										<div className="tw-w-full tw-grid tw-grid-cols-2 tw-gap-1">
											<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-600">
												Authorized by
											</div>
											<p className="tw-w-full tw-capitalize tw-flex tw-justify-end tw-text-base tw-text-gray-800 tw-font-bold">
												{
													policyHolder?.travelling_info
														?.user_policy_transaction[0]?.status_updated_by
												}
											</p>
										</div>
										<div className="tw-w-full tw-grid tw-grid-cols-2 tw-gap-1">
											<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-600">
												Authorized at
											</div>
											<p className="tw-w-full tw-capitalize tw-flex tw-justify-end tw-text-base tw-text-gray-800 tw-font-bold">
												{
													policyHolder?.travelling_info
														?.user_policy_transaction[0]?.status_update_date
												}
											</p>
										</div>
										{policyHolder?.travelling_info?.user_policy_transaction[0]
											?.reason && (
											<div className="tw-w-full tw-grid tw-grid-cols-2 tw-gap-1">
												<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-text-sm tw-text-gray-600">
													Reason
												</div>
												<p className="tw-w-full tw-capitalize tw-flex tw-justify-end tw-text-base tw-text-gray-800 tw-font-bold">
													{
														policyHolder?.travelling_info
															?.user_policy_transaction[0]?.reason
													}
												</p>
											</div>
										)}
									</div>
									{/*policyHolder?.travelling_info?.user_policy_transaction[0]?.reason && (
									<div className="tw-bg-[#7862AF]/20 tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-2 tw-h-fit tw-p-4 tw-rounded-lg">
										<p className="tw-w-fit tw-text-left tw-text-base">
											{policyHolder?.travelling_info?.user_policy_transaction[0]?.reason}
										</p>
									</div>
								)*/}
								</div>
							) : null}
						</div>
					)}

					{findPolicy.isLoading && (
						<div className="tw-w-full tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 xl:tw-grid-cols-2 tw-gap-5 tw-place-content-start tw-place-items-start">
							<div className="tw-w-full">
								<Stack spacing={1} sx={{ width: '100%' }}>
									<div className="tw-w-full tw-flex tw-justify-start tw-gap-4 tw-items-start">
										<div className="tw-w-fit">
											<Skeleton variant="rounded" width={100} height={100} />
										</div>
										<div className="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-1">
											<Skeleton
												variant="text"
												sx={{ fontSize: '2rem', width: '100%' }}
											/>
											<Skeleton
												variant="text"
												sx={{ fontSize: '1rem', width: '100%' }}
											/>
											<Skeleton
												variant="text"
												sx={{ fontSize: '1rem', width: '100%' }}
											/>
										</div>
									</div>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '100%' }}
									/>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '100%' }}
									/>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '100%' }}
									/>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '100%' }}
									/>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '100%' }}
									/>
									<Skeleton
										variant="text"
										sx={{ fontSize: '1rem', width: '100%' }}
									/>
									<Skeleton
										variant="text"
										sx={{ fontSize: '2rem', width: '100%' }}
									/>
									<Skeleton
										variant="text"
										sx={{ fontSize: '2rem', width: '100%' }}
									/>
								</Stack>
							</div>
						</div>
					)}

					{/* Show a not found message when policy holder search fails */}
					{notFound && (
						<h4 className="tw-text-xl tw-font-medium">User not Found</h4>
					)}

					{/* Initial information rendered when the user first opens this page */}
					{!notFound && !policyHolder && !findPolicy.isLoading && (
						<span className="tw-bg-[#7862AF]/20 tw-w-full tw-h-fit tw-p-3 md:tw-p-6 tw-rounded-lg">
							<h5 className="tw-mt-3 tw-w-full tw-text-left tw-text-[#7862AF] tw-font-semibold tw-text-lg md:tw-text-2xl">
								GVHIP Policy Search
							</h5>
							<h6 className="tw-mt-3 tw-w-full tw-text-left tw-text-[#171e41] tw-font-medium tw-text-lg md:tw-text-xl">
								Ensuring Every Visitor&apos;s Safe Stay in Ghana!
							</h6>

							<h6 className="tw-mt-5 tw-w-full tw-text-left tw-text-[#171e41] tw-font-medium tw-text-lg md:tw-text-xl">
								How to Find a Policy
							</h6>
							<p className="tw-w-full tw-mt-1 tw-text-left tw-text-sm md:tw-text-base">
								<strong className="tw-text-[#171e41]">
									1. Enter Passport Number or Policy Number:
								</strong>{' '}
								Use the passport number on your passport or the policy number
								generated for you.
								<br />
								<strong className="tw-text-[#171e41]">
									2. Click &apos;Search&apos;:
								</strong>{' '}
								The system will display the policy&apos;s validity, coverage,
								and other essential details.
								<br />
								<br />
								<strong className="tw-text-[#171e41]">A Warm Note:</strong>{' '}
								Let&apos;s remember, while the GVHIP is mandatory, it&apos;s
								also our way of showing that Ghana cares. Kindly visit our
								dedicated helpdesk if you have lapsed or missing policies.
							</p>
							<p className="tw-w-full tw-mt-4 tw-text-left tw-text-sm md:tw-text-base">
								<br />
								<br />
								<strong>Facing an issue with your search? </strong> Click{' '}
								<strong className="tw-text-[#7862AF]">here</strong> for
								immediate assistance.
							</p>
						</span>
					)}
				</div>

				{/* Show QR code scanner dialog */}
				{showScanner && (
					<div
						className="tw-w-screen tw-h-screen tw-fixed tw-top-0 tw-left-0 tw-z-[99] tw-flex tw-justify-center tw-items-end tw-bg-black/40"
						onClick={() => handleCloseScanner()}>
						<div
							data-aos="slide-up"
							data-aos-duration="800"
							onClick={(e) => e.stopPropagation()}
							className="tw-w-5/6 tw-h-[90vh] lg:tw-h-4/5 tw-rounded-t-2xl tw-p-4 md:tw-p-8 tw-bg-white tw-flex tw-flex-col tw-justify-start tw-items-center tw-gap-10">
							<div className="tw-flex tw-w-full tw-justify-between tw-items-center">
								<h2 className="tw-font-medium tw-text-2xl md:tw-text-4xl tw-text-[#171e41] tw-flex tw-justify-start tw-items-start tw-gap-1">
									Scan QR Code
								</h2>

								<IconButton
									aria-label="close scanner"
									onClick={() => handleCloseScanner()}>
									<IoClose className="tw-text-xl tw-text-[#8e6abf]" />
								</IconButton>
							</div>

							<div
								className="tw-rounded-xl tw-w-full md:tw-w-2/3 tw-h-fit tw-overflow-hidden"
								id="reader"></div>
						</div>
					</div>
				)}
			</div>
			<FooterFour />
		</>
	);
};

export default FindPolicy;
