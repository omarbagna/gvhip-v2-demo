import React from 'react';
import Link from 'next/link';

import aboutImg from '@/public/images/about/about1.jpg';
import BlurImage from '../BlurImage/BlurImage';

const AboutArea = () => {
	return (
		<div className="about-area ptb-100">
			<div className="container">
				<div className="row">
					<div className="col-lg-6 col-md-12">
						<div className="about-image bg1">
							<BlurImage src={aboutImg} alt="about" />
						</div>
					</div>
					<div className="col-lg-6 col-md-12">
						<div
							className="about-content"
							data-aos="fade-up"
							data-aos-duration="1200">
							<span className="sub-title">About Us</span>
							<h2>The story behind our consulting firm</h2>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id
								proin lectus in aliquam orci ornare nec. Commodo morbi tincidunt
								egestas velit.
							</p>
							<ul className="about-list">
								<li>
									<div className="icon">
										<i className="bx bx-check-double"></i>
									</div>
									Integrated Innovation
									<Link href="/services/services-details">
										<a className="link-btn">
											<i className="bx bx-chevron-right"></i>
										</a>
									</Link>
								</li>
								<li>
									<div className="icon">
										<i className="bx bx-check-double"></i>
									</div>
									Collaborative Culture
									<Link href="/services/services-details">
										<a className="link-btn">
											<i className="bx bx-chevron-right"></i>
										</a>
									</Link>
								</li>
								<li>
									<div className="icon">
										<i className="bx bx-check-double"></i>
									</div>
									Business Planning
									<Link href="/services/services-details">
										<a className="link-btn">
											<i className="bx bx-chevron-right"></i>
										</a>
									</Link>
								</li>
								<li>
									<div className="icon">
										<i className="bx bx-check-double"></i>
									</div>
									Professional Team
									<Link href="/services/services-details">
										<a className="link-btn">
											<i className="bx bx-chevron-right"></i>
										</a>
									</Link>
								</li>
								<li>
									<div className="icon">
										<i className="bx bx-check-double"></i>
									</div>
									13+ Years Experience
									<Link href="/services/services-details">
										<a className="link-btn">
											<i className="bx bx-chevron-right"></i>
										</a>
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutArea;
