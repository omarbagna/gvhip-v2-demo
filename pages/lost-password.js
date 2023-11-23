import React from 'react';
import Navbar from '@/components/Layout/Navigations/Navbar4';
import LostPasswordForm from '@/components/Authentication/LostPasswordForm';

const LostPassword = () => {
	return (
		<>
			<Navbar />
			<div className="page-title-area">
				<div className="container">
					<div className="page-title-content">
						<span className="sub-title">Reset Password</span>
						<h1>Forgot Your Password?</h1>
					</div>
				</div>
			</div>
			<LostPasswordForm />
		</>
	);
};

export default LostPassword;
