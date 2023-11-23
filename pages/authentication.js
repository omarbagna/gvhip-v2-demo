import React from 'react';
//import Navbar from '@/components/Layout/Navigations/Navbar4';
import Login from '@/components/Authentication/Login';
import { FaAppStoreIos } from 'react-icons/fa';
import { BsGooglePlay } from 'react-icons/bs';
import Link from 'next/link';
import logo from '@/public/images/gsti_logo.jpeg';
import BlurImage from '@/components/BlurImage/BlurImage';
//import Signup from '@/components/Authentication/Signup';
//import FooterFour from '@/components/Layout/Footer/FooterFour';

const Authentication = () => {
	return (
		<>
			<div className="page-title-area !tw-py-16">
				<div className="container">
					<div className="page-title-content">
						<Link href="/">
							<a className="tw-p-1 tw-flex tw-justify-center tw-items-center tw-gap-2">
								<BlurImage
									height={40}
									width={50}
									src={logo}
									alt="site logo"
									className="rounded-2"
								/>
								<span className="sub-title tw-flex tw-justify-center tw-items-center">
									Back to Home
								</span>
							</a>
						</Link>
						<Link href="/" passHref>
							<h1 className="tw-mt-4">
								Ghana Visitors Health Insurance Platform
							</h1>
						</Link>
					</div>
				</div>
			</div>
			<div className="profile-authentication-area ptb-75">
				<div className="container">
					<div className="row justify-content-center">
						<Login />

						<div className="tw-flex tw-w-full tw-mt-10 tw-justify-end tw-items-center tw-gap-3 tw-p-4 tw-rounded-lg md:tw-hidden">
							<div className="tw-w-1/2 tw-transition-all tw-duration-300 tw-flex tw-gap-2 tw-group tw-cursor-pointer tw-justify-between tw-items-center tw-rounded-md tw-p-2 tw-bg-black hover:tw-scale-110">
								<div className="tw-transition-all tw-duration-300 tw-text-secondary tw-capitalize group-hover:tw-text-[#8e6abf]">
									<p className="tw-text-xs tw-font-light tw-capitalize tw-text-gray-100">
										get it on
									</p>
									<p className="tw-text-sm lg:tw-text-base tw-font-medium tw-capitalize tw-text-white">
										Google Play
									</p>
								</div>
								<BsGooglePlay className="tw-text-white tw-shrink-0 tw-text-4xl" />
							</div>
							<div className="tw-w-1/2 tw-transition-all tw-duration-300 tw-flex tw-gap-2 tw-group tw-cursor-pointer tw-justify-between tw-items-center tw-rounded-md tw-p-2 tw-bg-gradient-to-tl tw-from-blue-700 tw-to-blue-500 hover:tw-scale-110">
								<div className="tw-transition-all tw-duration-300 tw-text-secondary tw-capitalize group-hover:tw-text-[#8e6abf]">
									<p className="tw-text-xs tw-font-light tw-capitalize tw-text-gray-100">
										download from the
									</p>
									<p className="tw-text-sm lg:tw-text-base tw-font-medium tw-capitalize tw-text-white">
										App Store
									</p>
								</div>
								<FaAppStoreIos className="tw-text-white tw-shrink-0 tw-text-4xl" />
							</div>
						</div>
						{/**
						<Signup />
						 */}
					</div>
				</div>
			</div>
		</>
	);
};

export default Authentication;
