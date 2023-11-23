'use client';

import React from 'react';
import Link from '@/utils/ActiveLink';

import logo from '@/public/images/gsti_logo.jpeg';
import ministryLogo from '@/public/images/ministry-logo.png';
import immigrationLogo from '@/public/images/GIS-LOGO.jpg';
import ghsLogo from '@/public/images/ghs.jpg';
import {
	Avatar,
	Backdrop,
	Badge,
	CircularProgress,
	Skeleton,
} from '@mui/material';
import { BsChevronDown } from 'react-icons/bs';
import { BiHomeAlt, BiUser } from 'react-icons/bi';
import { MdOutlinePolicy } from 'react-icons/md';
import { signOut, useSession } from 'next-auth/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { TbCalendarStats } from 'react-icons/tb';
import BlurImage from '@/components/BlurImage/BlurImage';
//import useAxiosAuth from 'hooks/useAxiosAuth';

const DashboardNav = () => {
	//const axiosPrivate = useAxiosAuth();

	const { data: session, status } = useSession();

	const [loading, setLoading] = React.useState(false);
	const [menu, setMenu] = React.useState(false);
	const toggleDropdown = () => {
		setMenu((prev) => !prev);
	};

	const logOut = async (e) => {
		e.preventDefault();
		setLoading(true);

		await signOut({ callbackUrl: '/' });

		setLoading(false);
	};

	return (
		<>
			<div id="navbar" className="navbar-area">
				{/** Top Nav */}
				<div className="tw-fixed tw-z-40 tw-top-0 tw-w-full tw-h-20 tw-bg-white tw-border-b-2 tw-flex tw-justify-between tw-items-center tw-gap-8 tw-py-1 tw-px-5 md:tw-px-10 tw-overflow-hidden">
					<Link href="/">
						<a className="navbar-brand p-1">
							<BlurImage
								height={60}
								width={session?.user?.user?.agency === 'ministries' ? 180 : 60}
								src={
									session?.user?.user?.agency === 'immigration'
										? immigrationLogo
										: session?.user?.user?.agency === 'ministries'
										? ministryLogo
										: session?.user?.user?.agency === 'porthealth'
										? ghsLogo
										: logo
								}
								alt="site logo"
								className={`rounded-2 ${
									session?.user?.user?.agency === 'ministries'
										? 'tw-bg-black'
										: ''
								}`}
							/>
						</a>
					</Link>
					<h1>
						{session?.user?.user?.agency === 'immigration'
							? 'Ghana Immigration Service'
							: session?.user?.user?.agency === 'ministries'
							? 'Ministry of Foreign Affairs'
							: session?.user?.user?.agency === 'porthealth'
							? 'Ghana Port Health Service (GHS)'
							: null}
					</h1>
					<div
						className="tw-transition-all tw-duration-150 tw-shrink-0 tw-ease-in tw-w-fit tw-h-fit tw-p-1 tw-cursor-pointer tw-rounded-md hover:tw-bg-slate-400/10"
						onClick={toggleDropdown}>
						{status === 'loading' ? (
							<div className="tw-w-fit tw-h-full tw-flex tw-justify-center tw-items-center tw-gap-2 tw-overflow-hidden">
								<Skeleton variant="circular" width={40} height={40} />
								<Skeleton
									variant="text"
									sx={{ fontSize: '2rem', width: '100px' }}
								/>
							</div>
						) : (
							<div className="tw-w-fit tw-h-full tw-flex tw-justify-center tw-items-center tw-gap-2 tw-overflow-hidden">
								<Badge
									color={'success'}
									//className={network?.online ? '' : 'animate-pulse'}
									overlap="circular"
									badgeContent=" "
									variant="dot">
									<Avatar src="#" className="tw-uppercase tw-scale-75">
										{session?.user?.user?.first_name[0]}
										{session?.user?.user?.last_name[0]}
									</Avatar>
								</Badge>
								<h3 className="tw-font-semibold tw-text-base tw-capitalize">
									{session?.user?.user?.first_name}
								</h3>
								<BsChevronDown />
							</div>
						)}
					</div>

					{menu && (
						<div
							onClick={toggleDropdown}
							className="tw-w-full tw-h-full tw-fixed tw-left-0 tw-top-0 tw-pr-10 tw-pt-16 tw-flex tw-justify-end tw-items-start">
							<div
								onClick={(e) => e.stopPropagation()}
								className="tw-bg-white tw-w-fit tw-h-fit tw-rounded-lg tw-shadow-md tw-p-3 tw-flex tw-flex-col tw-justify-start tw-items-start">
								<Link
									href={
										session?.user?.user?.role === 'guest'
											? '/guest/profile'
											: session?.user?.user?.role === 'company'
											? '/company/profile'
											: session?.user?.user?.role === 'policy_holder'
											? '/policy-holder/profile'
											: '/immigration/profile'
									}>
									<span className="tw-cursor-pointer tw-w-44 tw-text-sm tw-text-gray-700 tw-font-medium hover:tw-text-[#8e6abf] tw-p-2 tw-rounded-lg hover:tw-bg-[#8e6abf]/10">
										Profile
									</span>
								</Link>
								<span
									onClick={(e) => logOut(e)}
									className="tw-cursor-pointer tw-w-44 tw-text-sm tw-text-gray-700 tw-font-medium hover:tw-text-[#8e6abf] tw-p-2 tw-rounded-lg hover:tw-bg-[#8e6abf]/10">
									Logout
								</span>
							</div>
						</div>
					)}
				</div>

				{/** Side Nav */}
				{status === 'loading' ? (
					<div className="tw-h-fit lg:tw-h-full tw-fixed lg:tw-z-40 tw-bottom-0 lg:tw-top-20 tw-left-0 tw-flex tw-gap-2 lg:tw-flex-col tw-justify-center lg:tw-justify-start tw-items-center lg:tw-items-start tw-w-full lg:tw-w-fit tw-bg-white tw-border-t-2 lg:tw-border-t-0 lg:tw-border-r-2">
						<Skeleton
							variant="text"
							sx={{ fontSize: '2rem', width: '200px' }}
						/>
						<Skeleton
							variant="text"
							sx={{ fontSize: '2rem', width: '200px' }}
						/>
						<Skeleton
							variant="text"
							sx={{ fontSize: '2rem', width: '200px' }}
						/>
					</div>
				) : (
					<div className="tw-h-fit lg:tw-h-full tw-fixed lg:tw-z-40 tw-bottom-0 lg:tw-top-20 tw-left-0 tw-flex lg:tw-flex-col tw-justify-center lg:tw-justify-start tw-items-center lg:tw-items-start tw-w-full lg:tw-w-fit tw-bg-white tw-border-t-2 lg:tw-border-t-0 lg:tw-border-r-2">
						{session?.user?.user?.role !== 'immigration_officer' ? (
							<>
								<Link
									href={
										session?.user?.user?.role === 'guest'
											? '/guest'
											: session?.user?.user?.role === 'company'
											? '/company'
											: session?.user?.user?.role === 'policy_holder' &&
											  '/policy-holder'
									}
									activeClassName="tw-bg-[#7862AF]/10 tw-text-[#7862AF] tw-font-medium">
									<a className="tw-w-fit lg:tw-w-56 tw-py-4 tw-px-6 tw-flex tw-flex-col tw-justify-center tw-items-center lg:tw-flex-row lg:tw-justify-start lg:tw-items-end tw-gap-2 hover:tw-text-[#7862AF]">
										<BiHomeAlt className="tw-shrink-0 tw-text-2xl" /> Dashboard
									</a>
								</Link>
								{session?.user?.user?.role === 'policy_holder' && (
									<Link
										href={
											session?.user?.user?.role === 'guest'
												? '/guest/manage-policy'
												: session?.user?.user?.role === 'company'
												? '/company/manage-policy'
												: session?.user?.user?.role === 'policy_holder' &&
												  '/policy-holder/manage-policy'
										}
										activeClassName="tw-bg-[#7862AF]/10 tw-text-[#7862AF] tw-font-medium">
										<a className="tw-w-fit lg:tw-w-56 tw-py-4 tw-px-6 tw-flex tw-flex-col tw-justify-center tw-items-center lg:tw-flex-row lg:tw-justify-start lg:tw-items-end tw-gap-2 hover:tw-text-[#7862AF]">
											<MdOutlinePolicy className="tw-shrink-0 tw-text-2xl" />{' '}
											Manage Policy
										</a>
									</Link>
								)}
								<Link
									href={
										session?.user?.user?.role === 'guest'
											? '/guest/profile'
											: session?.user?.user?.role === 'company'
											? '/company/profile'
											: session?.user?.user?.role === 'policy_holder' &&
											  '/policy-holder/profile'
									}
									activeClassName="tw-bg-[#7862AF]/10 tw-text-[#7862AF] tw-font-medium">
									<a className="tw-w-fit lg:tw-w-56 tw-py-4 tw-px-6 tw-flex tw-flex-col tw-justify-center tw-items-center lg:tw-flex-row lg:tw-justify-start lg:tw-items-end tw-gap-2 hover:tw-text-[#7862AF]">
										<BiUser className="tw-shrink-0 tw-text-2xl" /> Profile
									</a>
								</Link>
							</>
						) : (
							session?.user?.user?.role === 'immigration_officer' && (
								<>
									<Link
										href="/immigration"
										activeClassName="tw-bg-[#7862AF]/10 tw-text-[#7862AF] tw-font-medium">
										<a className="tw-w-fit lg:tw-w-56 tw-py-4 tw-px-6 tw-flex tw-flex-col tw-justify-center tw-items-center lg:tw-flex-row lg:tw-justify-start lg:tw-items-end tw-gap-2 hover:tw-text-[#7862AF]">
											<BiHomeAlt className="tw-shrink-0 tw-text-2xl" />{' '}
											Dashboard
										</a>
									</Link>
									<Link
										href="/immigration/stats"
										activeClassName="tw-bg-[#7862AF]/10 tw-text-[#7862AF] tw-font-medium">
										<a className="tw-w-fit lg:tw-w-56 tw-py-4 tw-px-6 tw-flex tw-flex-col tw-justify-center tw-items-center lg:tw-flex-row lg:tw-justify-start lg:tw-items-end tw-gap-2 hover:tw-text-[#7862AF]">
											<TbCalendarStats className="tw-shrink-0 tw-text-2xl" />{' '}
											Statistics
										</a>
									</Link>
									<Link
										href="/immigration/find-policy"
										activeClassName="tw-bg-[#7862AF]/10 tw-text-[#7862AF] tw-font-medium">
										<a className="tw-w-fit lg:tw-w-56 tw-py-4 tw-px-6 tw-flex tw-flex-col tw-justify-center tw-items-center lg:tw-flex-row lg:tw-justify-start lg:tw-items-end tw-gap-2 hover:tw-text-[#7862AF]">
											<AiOutlineSearch className="tw-shrink-0 tw-text-2xl" />{' '}
											Find Policy
										</a>
									</Link>
									<Link
										href="/immigration/profile"
										activeClassName="tw-bg-[#7862AF]/10 tw-text-[#7862AF] tw-font-medium">
										<a className="tw-w-fit lg:tw-w-56 tw-py-4 tw-px-6 tw-flex tw-flex-col tw-justify-center tw-items-center lg:tw-flex-row lg:tw-justify-start lg:tw-items-end tw-gap-2 hover:tw-text-[#7862AF]">
											<BiUser className="tw-shrink-0 tw-text-2xl" /> Profile
										</a>
									</Link>
								</>
							)
						)}
					</div>
				)}
			</div>

			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={loading}>
				<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
					<CircularProgress color="inherit" />
					<p className="tw-text-white tw-font-medium tw-text-center tw-text-lg tw-w-full">
						Signing out
					</p>
				</div>
			</Backdrop>
		</>
	);
};

export default DashboardNav;
