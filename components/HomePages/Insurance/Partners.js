import React from 'react';
import ministryLogo from '@/public/images/ministry-logo.png';
import immigrationLogo from '@/public/images/GIS-LOGO.jpg';
import ghsLogo from '@/public/images/ghs.jpg';
import airlinesLogo from '@/public/images/ghana-airlines.gif';
import BlurImage from '@/components/BlurImage/BlurImage';

const Partners = () => {
	return (
		<div className="features-area pt-100 pb-75">
			<div className="container">
				<div className="section-title">
					<span className="sub-title dark-green-color">Partners</span>
					<h2 className="nunito-font">Our Key Partners</h2>
				</div>
				<div className="row justify-content-center">
					<div
						className="col-lg-3 col-md-6 col-sm-6"
						data-aos="fade-up"
						data-aos-duration="1200">
						<div className="single-features-item tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-5">
							<a href="https://mfa.gov.gh/" target="_blank" rel="noreferrer">
								<BlurImage
									src={ministryLogo}
									alt="ministry logo"
									width={230}
									height={100}
									className="rounded-2 tw-bg-black"
								/>
							</a>
						</div>
					</div>
					<div
						className="col-lg-3 col-md-6 col-sm-6"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="100">
						<div className="single-features-item tw-flex tw-flex-col tw-justify-center tw-items-center">
							<a
								href="https://home.gis.gov.gh/"
								target="_blank"
								rel="noreferrer">
								<BlurImage
									src={immigrationLogo}
									alt="immigration logo"
									width={120}
									height={120}
								/>
							</a>
						</div>
					</div>
					<div
						className="col-lg-3 col-md-6 col-sm-6"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="200">
						<div className="single-features-item tw-flex tw-flex-col tw-justify-center tw-items-center">
							<a href="https://ghs.gov.gh/" target="_blank" rel="noreferrer">
								<BlurImage
									src={ghsLogo}
									alt="ghs logo"
									width={120}
									height={120}
								/>
							</a>
						</div>
					</div>
					<div
						className="col-lg-3 col-md-6 col-sm-6"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="200">
						<div className="single-features-item tw-flex tw-flex-col tw-justify-center tw-items-center">
							<a
								href="https://www.alternativeairlines.com/ghana-international"
								target="_blank"
								rel="noreferrer">
								<BlurImage
									src={airlinesLogo}
									alt="ghana airlines logo"
									width={120}
									height={120}
								/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Partners;
