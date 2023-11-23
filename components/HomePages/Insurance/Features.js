import React from 'react';

const Features = () => {
	return (
		<div className="features-area pt-100 pb-75">
			<div className="container">
				<div className="section-title">
					<span className="sub-title dark-green-color">Key Features</span>
					<h2 className="nunito-font">We provide the best for our clients</h2>
				</div>
				<div className="row justify-content-center">
					<div
						className="col-lg-4 col-md-6 col-sm-6"
						data-aos="fade-up"
						data-aos-duration="1200">
						<div className="single-features-item">
							<div className="icon">
								<i className="flaticon-beach-umbrella"></i>
							</div>
							<h3 className="nunito-font">Wide Coverage</h3>
							<p>
								Our extensive network of healthcare providers spans across the
								entire country.
							</p>
						</div>
					</div>
					<div
						className="col-lg-4 col-md-6 col-sm-6"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="100">
						<div className="single-features-item">
							<div className="icon">
								<i className="flaticon-ok"></i>
							</div>
							<h3 className="nunito-font">Hassle Free</h3>
							<p>
								Efficient claims processing ensures clients get required support
								promptly.
							</p>
						</div>
					</div>
					<div
						className="col-lg-4 col-md-6 col-sm-6"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="200">
						<div className="single-features-item">
							<div className="icon">
								<i className="flaticon-fast-time"></i>
							</div>
							<h3 className="nunito-font">Best Price</h3>
							<p>Clear and fair pricing based on industry best practice.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Features;
