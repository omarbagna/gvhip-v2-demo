import React from 'react';
//import Navbar from '@/components/Layout/Navigations/Navbar4';
import ResetPasswordForm from '@/components/Authentication/ResetPasswordForm';
import Link from 'next/link';
import logo from '@/public/images/gsti_logo.jpeg';
import BlurImage from '@/components/BlurImage/BlurImage';
//import Signup from '@/components/Authentication/Signup';
//import FooterFour from '@/components/Layout/Footer/FooterFour';

const ResetPassword = () => {
	return (
		<>
			<div className="page-title-area">
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
							</a>
						</Link>
						<Link href="/" passHref>
							<h1 className="tw-mt-4">Reset Password</h1>
						</Link>
					</div>
				</div>
			</div>
			<div className="profile-authentication-area ptb-75">
				<div className="container">
					<div className="row justify-content-center">
						<ResetPasswordForm />
					</div>
				</div>
			</div>
		</>
	);
};

export default ResetPassword;
