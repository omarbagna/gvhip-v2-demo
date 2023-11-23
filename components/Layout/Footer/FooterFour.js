import React from 'react';
import Link from 'next/link';

import logo from '@/public/images/gsti_logo.jpeg';
import BlurImage from '@/components/BlurImage/BlurImage';

const FooterFour = () => {
	const currentYear = new Date().getFullYear();
	return (
		<div className="template-footer-four pt-100 tw-bg-[#E8FBFE]">
			<div className="container">
				<div className="row justify-content-between">
					<div className="col-lg-3 col-md-6">
						<div className="single-footer-widget">
							<h3 className="nunito-font">About Us</h3>
							<ul className="quick-links">
								<li>
									<Link href="/about-us-2">
										<a>Our Story</a>
									</Link>
								</li>

								<li>
									<Link href="/blogs/blog-grid">
										<a>Latest News</a>
									</Link>
								</li>
								<li>
									<Link href="/contact">
										<a>Contact Us</a>
									</Link>
								</li>
								<li>
									<Link href="/terms-conditions">
										<a>Terms & Condition</a>
									</Link>
								</li>
								<li>
									<Link href="/privacy-policy">
										<a>Privacy Policy</a>
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className="col-lg-3 col-md-6">
						<div className="single-footer-widget">
							<h3 className="nunito-font">Quick Links</h3>
							<ul className="quick-links">
								<li>
									<Link href="/">
										<a>Home</a>
									</Link>
								</li>
								<li>
									<Link href="/about-us-2">
										<a>About Us</a>
									</Link>
								</li>
								<li>
									<Link href="/blogs/blog-grid">
										<a>Latest News</a>
									</Link>
								</li>
								<li>
									<Link href="/contact">
										<a>Contact Us</a>
									</Link>
								</li>
								<li>
									<Link href="/privacy-policy">
										<a>Privacy Policy</a>
									</Link>
								</li>
								<li>
									<Link href="/terms-conditions">
										<a>Terms & Condition</a>
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className="col-lg-3 col-md-6">
						<div className="single-footer-widget">
							<h3 className="nunito-font">Newsletter</h3>
							<div className="box">
								<p>Latest resources, sent to your inbox weekly</p>
								<form className="newsletter-form">
									<input
										type="text"
										className="input-newsletter"
										placeholder="Enter your email address"
										name="EMAIL"
										required
										autoComplete="off"
									/>
									<button
										type="submit"
										className="btn-style-one dark-green-color">
										Subscribe Now <i className="bx bx-chevron-right"></i>
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="copyright-area">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-4 col-md-5">
							<p>
								&copy; {currentYear} GVHIP. All Rights Reserved
								{/**
                <a
                  href="https://envytheme.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  EnvyTheme
                </a>
                 */}
							</p>
						</div>
						<div className="col-lg-4 col-md-3">
							<div className="logo">
								<Link href="/">
									<a>
										<BlurImage
											height={40}
											width={50}
											src={logo}
											alt="logo"
											className="tw-rounded-lg"
										/>
									</a>
								</Link>
							</div>
						</div>
						<div className="col-lg-4 col-md-4">
							<ul className="social-links">
								<li>
									<a
										href="https://www.facebook.com/"
										target="_blank"
										rel="noreferrer">
										<i className="flaticon-facebook-app-symbol"></i>
									</a>
								</li>
								<li>
									<a
										href="https://www.twitter.com/"
										target="_blank"
										rel="noreferrer">
										<i className="flaticon-twitter"></i>
									</a>
								</li>
								<li>
									<a
										href="https://www.linkedin.com/"
										target="_blank"
										rel="noreferrer">
										<i className="flaticon-linkedin"></i>
									</a>
								</li>
								<li>
									<a
										href="https://www.instagram.com/"
										target="_blank"
										rel="noreferrer">
										<i className="flaticon-instagram"></i>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FooterFour;
