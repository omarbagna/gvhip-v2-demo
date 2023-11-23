import React from 'react';
import Link from 'next/link';

import joinOutCommunityImg from '@/public/images/joinCommunity.png';
import BlurImage from '@/components/BlurImage/BlurImage';

const JoinOurCommunity = () => {
	return (
		<div className="join-our-community-area bg-e8fcff ptb-100">
			<div className="container">
				<div className="row align-items-center">
					<div
						className="col-lg-6 col-md-12"
						data-aos="fade-up"
						data-aos-duration="1200">
						<div className="join-our-community-image">
							<BlurImage
								src={joinOutCommunityImg}
								alt="join-out-community"
								className="tw-rounded-lg tw-overflow-hidden"
							/>
						</div>
					</div>
					<div className="col-lg-6 col-md-12">
						<div className="join-our-community-content">
							<span
								className="sub-title"
								data-aos="fade-up"
								data-aos-duration="1200">
								Join Our Community
							</span>
							<h2
								className="nunito-font"
								data-aos="fade-up"
								data-aos-duration="1200"
								data-aos-delay="100">
								Leading provider of Travel Insurance solutions
							</h2>
							<p
								data-aos="fade-up"
								data-aos-duration="1200"
								data-aos-delay="200">
								Protect your travel adventures and embrace peace of mind with
								our comprehensive travel insurance plans, tailored to meet your
								specific needs, so you can focus on creating unforgettable
								memories without worries or setbacks.
							</p>
							<div
								className="btn-box"
								data-aos="fade-up"
								data-aos-duration="1200"
								data-aos-delay="300">
								<Link href="/form/purchase-plan">
									<a className="btn-style-one crimson-color">
										Get Started <i className="bx bx-chevron-right"></i>
									</a>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default JoinOurCommunity;
