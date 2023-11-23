import React from 'react';

import overviewImg1 from '@/public/images/overview/overview1.png';
import overviewImg2 from '@/public/images/overview/overview2.png';
import BlurImage from '../BlurImage/BlurImage';

const Overview = () => {
	return (
		<div className="overview-area ptb-100 bg-f9f9f9">
			<div className="container">
				<div className="overview-box">
					<div className="row align-items-center">
						<div className="col-lg-6 col-md-12 overview-image">
							<BlurImage src={overviewImg1} data-aos="fade-up" alt="overview" />
						</div>
						<div className="col-lg-6 col-md-12 overview-content">
							<span className="sub-title">Why Choose Us?</span>
							<h2>We are here, to help your startup business</h2>
							<ul className="overview-list">
								<li data-aos="fade-up" data-aos-duration="1200">
									<span>
										<i className="flaticon-draw-check-mark"></i>
										Cloud Databases
									</span>
								</li>
								<li
									data-aos="fade-up"
									data-aos-duration="1200"
									data-aos-delay="100">
									<span>
										<i className="flaticon-draw-check-mark"></i>
										Website Hosting
									</span>
								</li>
								<li
									data-aos="fade-up"
									data-aos-duration="1200"
									data-aos-delay="200">
									<span>
										<i className="flaticon-draw-check-mark"></i>
										Remote Desktop
									</span>
								</li>
								<li
									data-aos="fade-up"
									data-aos-duration="1200"
									data-aos-delay="300">
									<span>
										<i className="flaticon-draw-check-mark"></i>
										File Backup
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="overview-box">
					<div className="row align-items-center">
						<div className="col-lg-6 col-md-12 overview-content">
							<span className="sub-title">Our Goal</span>
							<h2>Best IT & technology service in your area</h2>
							<ul className="overview-list">
								<li data-aos="fade-up" data-aos-duration="1200">
									<span>
										<i className="flaticon-draw-check-mark"></i>
										Design & Development
									</span>
								</li>
								<li
									data-aos="fade-up"
									data-aos-duration="1200"
									data-aos-delay="100">
									<span>
										<i className="flaticon-draw-check-mark"></i>
										Android Apps Development
									</span>
								</li>
								<li
									data-aos="fade-up"
									data-aos-duration="1200"
									data-aos-delay="200">
									<span>
										<i className="flaticon-draw-check-mark"></i>
										Laravel Web Development
									</span>
								</li>
								<li
									data-aos="fade-up"
									data-aos-duration="1200"
									data-aos-delay="300">
									<span>
										<i className="flaticon-draw-check-mark"></i>
										React Web Development
									</span>
								</li>
							</ul>
						</div>
						<div className="col-lg-6 col-md-12 overview-image">
							<BlurImage src={overviewImg2} data-aos="fade-up" alt="overview" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Overview;
