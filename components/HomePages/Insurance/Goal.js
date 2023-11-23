import React from 'react';
import Link from 'next/link';

import goalImg from '@/public/images/goal.webp';
import BlurImage from '@/components/BlurImage/BlurImage';

const Goal = () => {
	return (
		<div className="goal-area with-top-border ptb-100">
			<div className="container">
				<div className="row align-items-center">
					<div
						className="col-lg-6 col-md-12"
						data-aos="fade-up"
						data-aos-duration="1200">
						<div className="goal-image">
							<BlurImage
								src={goalImg}
								alt="goal-image"
								className="tw-rounded-lg tw-overflow-hidden"
							/>
						</div>
					</div>

					<div className="col-lg-6 col-md-12">
						<div className="goal-content">
							<span className="sub-title">Our Goal</span>
							<h2 className="nunito-font">
								Protecting our clients on their travels
							</h2>
							<ul className="overview-list">
								<li data-aos="fade-up" data-aos-duration="1200">
									<i className="flaticon-draw-check-mark"></i>
									We invest for long-term results
								</li>
								<li
									data-aos="fade-up"
									data-aos-duration="1200"
									data-aos-delay="100">
									<i className="flaticon-draw-check-mark"></i>
									We manage risk in-house, in real time
								</li>
								<li
									data-aos="fade-up"
									data-aos-duration="1200"
									data-aos-delay="200">
									<i className="flaticon-draw-check-mark"></i>
									We have a client-centred team of professionals
								</li>
							</ul>
							<div
								className="btn-box"
								data-aos="fade-up"
								data-aos-duration="1200"
								data-aos-delay="300">
								<Link href="/form/purchase-plan">
									<a className="btn-style-one dark-green-color">
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

export default Goal;
