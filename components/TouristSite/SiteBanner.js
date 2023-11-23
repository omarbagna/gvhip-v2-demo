import React from 'react';
import BlurImage from '../BlurImage/BlurImage';

const SiteBanner = ({ name, alt, image }) => {
	return (
		<div className="tw-w-full tw-h-fit tw-pt-24 lg:tw-pt-32 lg:tw-pb-24 lg:tw-px-14 tw-flex tw-flex-col tw-justify-start tw-items-center tw-bg-[#fffbfb]">
			<div className="tw-w-full tw-h-full tw-flex tw-justify-center lg:tw-justify-between tw-items-center tw-gap-5 tw-p-0">
				<div className="insurance-banner-content tw-hidden lg:tw-block">
					<span
						className="sub-title"
						data-aos="fade-up"
						data-aos-duration="1200">
						Things To Do At
					</span>
					<h1
						data-aos="fade-up"
						data-aos-duration="1200"
						className="nunito-font tw-w-3/4 tw-capitalize"
						data-aos-delay="100">
						{name}
					</h1>
				</div>
				<div className="tw-relative tw-w-full lg:tw-w-1/2 tw-h-[30vh] lg:tw-h-[50vh] tw-overflow-hidden lg:tw-rounded-lg tw-cursor-pointer">
					<div className="tw-transition-all tw-duration-300 tw-ease-in-out tw-absolute tw-z-10 tw-top-0 tw-left-0 tw-bg-[#8e6abf]/40 tw-w-full tw-h-full tw-flex tw-flex-col tw-gap-1 tw-justify-center tw-items-center tw-cursor-pointer">
						<p className="tw-capitalize tw-text-base tw-text-gray-100 lg:tw-hidden">
							Things to do at
						</p>
						<h3 className="nunito-font tw-capitalize tw-transition-all tw-duration-300 tw-ease-in-out tw-text-center tw-px-4 tw-text-white tw-text-4xl md:tw-text-5xl tw-cursor-pointer lg:tw-hidden">
							{name}
						</h3>
					</div>
					<BlurImage
						src={image}
						alt={alt}
						width={0}
						height={0}
						layout="fill"
						objectFit="cover"
						className="lg:tw-rounded-lg tw-cursor-pointer tw-transition-all tw-duration-300 tw-ease-in-out"
					/>
				</div>
			</div>
		</div>
	);
};

export default SiteBanner;
