import React from 'react';
//import Navbar from '@/components/Layout/Navigations/Navbar4';
import AgencyLogin from '@/components/Authentication/AgencyLogin';
import Link from 'next/link';
import logo from '@/public/images/GIS-LOGO.jpg';
import BlurImage from '@/components/BlurImage/BlurImage';
//import Signup from '@/components/Authentication/Signup';
//import FooterFour from '@/components/Layout/Footer/FooterFour';

const Immigration = () => {
	return (
		<>
			<div className="page-title-area !tw-py-16">
				<div className="container">
					<div className="page-title-content">
						<Link href="/">
							<a className="tw-p-1 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2">
								<span className="sub-title tw-flex tw-justify-center tw-items-center">
									Back to Home
								</span>
								<BlurImage
									height={120}
									width={120}
									src={logo}
									alt="immigration logo"
									className="rounded-2 tw-mix-blend-multiply"
								/>
							</a>
						</Link>
						<Link href="/" passHref>
							<h1 className="tw-mt-4">Ghana Immigration Service Sign in</h1>
						</Link>
					</div>
				</div>
			</div>
			<div className="profile-authentication-area ptb-75">
				<div className="container">
					<div className="row justify-content-center">
						<AgencyLogin />
					</div>
				</div>
			</div>
		</>
	);
};

export default Immigration;
