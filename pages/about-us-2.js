import React from 'react';
import Navbar from '@/components/Layout/Navigations/Navbar4';
import Goal from '@/components/AboutUsTwo/Goal';
import Target from '@/components/HomePages/Insurance/Target';
import HowToApply from '@/components/HomePages/Insurance/HowToApply';
//import Testimonials from '@/components/AboutUsTwo/Testimonials';
import Faq from '@/components/AboutUsTwo/Faq';
//import JoinOurCommunity from '@/components/HomePages/Insurance/JoinOurCommunity';
import FooterFour from '@/components/Layout/Footer/FooterFour';

const AboutUs2 = () => {
	return (
		<>
			<Navbar />
			<div className="page-title-area">
				<div className="container">
					<div className="page-title-content">
						<span className="sub-title dark-green-color">About Us</span>
						{/*
							<h1 className="nunito-font">
								Welcome to the Ghana Visitors Health Insurance Platform Portal
							</h1>
						*/}
					</div>
				</div>
			</div>
			<Target />
			<Goal />
			<HowToApply />
			{/**
			<Testimonials />
			<JoinOurCommunity />
			 */}
			<Faq />
			<FooterFour />
		</>
	);
};

export default AboutUs2;
