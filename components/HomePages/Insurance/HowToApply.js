import React from 'react';
import Link from 'next/link';

import arrowImg from '@/public/images/arrow.png';
import BlurImage from '@/components/BlurImage/BlurImage';

const HowToApply = () => {
	return (
		<div className="how-to-apply-area ptb-100 bg-263238">
			<div className="container">
				<div className="section-title white-color">
					<span className="sub-title">Application Process</span>
					<h2 className="nunito-font">Get your travel insurance today</h2>
				</div>
				<div className="apply-arrow">
					<div className="arrow">
						<BlurImage
							src={arrowImg}
							data-aos="fade-down"
							data-aos-duration="1200"
							data-aos-delay="400"
							alt="arrow"
						/>
					</div>
					<div className="row justify-content-center">
						<div
							className="col-lg-4 col-md-6 col-sm-6"
							data-aos="fade-up"
							data-aos-duration="1200">
							<div className="single-how-to-apply-box">
								<div className="number">1</div>
								<h3 className="nunito-font">Create Your Account</h3>
								<p>Sign up using your valid passport details.</p>
							</div>
						</div>
						<div
							className="col-lg-4 col-md-6 col-sm-6"
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-delay="100">
							<div className="single-how-to-apply-box">
								<div className="number">2</div>
								<h3 className="nunito-font">Select Your Coverage Duration</h3>
								<p>
									Choose from our flexible plans tailored to the length of your
									stay.
								</p>
							</div>
						</div>
						<div
							className="col-lg-4 col-md-6 col-sm-6"
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-delay="200">
							<div className="single-how-to-apply-box">
								<div className="number">3</div>
								<h3 className="nunito-font">
									Pay & Receive Your Policy Certificate
								</h3>
								<p>
									Secure payment gateways ensure a smooth transaction. Receive
									your policy certificate electronically issued for your
									convenience.
								</p>
							</div>
						</div>

						<div
							className="col-lg-12 col-md-12 col-sm-12"
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-delay="300">
							<div className="lets-start-box">
								<Link href="/form/purchase-plan">
									<a className="btn-style-one dark-green-color">
										Get Started <i className="bx bx-chevron-right"></i>
									</a>
								</Link>
							</div>
						</div>
						<div
							className="col-lg-12 col-md-12 col-sm-12 tw-mt-10 tw-flex tw-justify-center tw-items-center"
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-delay="300">
							<div className="tw-bg-red-500/40 tw-w-2/3 tw-h-fit tw-text-white tw-text-left tw-font-light tw-p-4 tw-rounded-lg">
								<strong>Notice:</strong> The Ghana Visitors Health Insurance
								Platform (GVHIP) is a mandatory requirement for non-Ghanaian
								passport holders visiting Ghana. This initiative safeguards your
								health while you explore our country.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HowToApply;
