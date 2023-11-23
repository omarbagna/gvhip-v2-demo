import React from 'react';
import Link from 'next/link';

import manWithSon from '@/public/images/man-with-son.webp';
import BlurImage from '@/components/BlurImage/BlurImage';

const Target = () => {
	return (
		<div className="goal-area ptb-100">
			<div className="container">
				<div className="row align-items-center">
					<div className="col-lg-6 col-md-12">
						<div className="goal-content style-two">
							<span className="sub-title">Why Us</span>
							<h2 className="nunito-font">
								Why Ghana Visitors Health Insurance Platform (GVHIP)?
							</h2>
							<ul className="overview-list">
								<li data-aos="fade-up" data-aos-duration="1200">
									<i className="flaticon-draw-check-mark"></i>
									Peace of Mind: Comprehensive medical coverage for visitors to
									Ghana.
								</li>
								<li
									data-aos="fade-up"
									data-aos-duration="1200"
									data-aos-delay="100">
									<i className="flaticon-draw-check-mark"></i>
									Effortless Process: Purchase, manage, and renew your policy
									with just a few clicks!
								</li>
								<li
									data-aos="fade-up"
									data-aos-duration="1200"
									data-aos-delay="200">
									<i className="flaticon-draw-check-mark"></i>
									Support at Every Step: Facing an issue? Our dedicated support
									team is here to assist 24/7.
								</li>
							</ul>
							<div
								className="btn-box"
								data-aos="fade-up"
								data-aos-duration="1200"
								data-aos-delay="300">
								<Link href="/form/purchase-plan">
									<a className="btn-style-one dark-green-color">
										Get Started Now <i className="bx bx-chevron-right"></i>
									</a>
								</Link>
							</div>
						</div>
					</div>
					<div
						className="col-lg-6 col-md-12"
						data-aos="fade-up"
						data-aos-duration="1200">
						<div className="goal-image style-two">
							<BlurImage
								src={manWithSon}
								alt="man-with-son-image"
								className="tw-rounded-lg tw-overflow-hidden"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Target;
