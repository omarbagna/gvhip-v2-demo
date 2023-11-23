import React from 'react';
import BlurImage from '../BlurImage/BlurImage';

const ActivitiesGrid = ({ activities }) => {
	return (
		<div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-3 tw-place-items-center">
			{activities?.map((activity) => (
				<div
					key={activity?.id}
					data-aos="fade-up"
					data-aos-duration="1200"
					data-aos-delay={`${activity?.id}00`}
					className="tw-group tw-relative tw-w-full tw-h-52 tw-overflow-hidden lg:tw-rounded-lg tw-cursor-default">
					<div className="tw-transition-all tw-duration-300 tw-ease-in-out tw-absolute tw-z-10 tw-top-0 tw-left-0 tw-bg-[#8e6abf]/50 tw-w-full tw-h-full tw-flex tw-flex-col tw-gap-1 tw-justify-center tw-items-center tw-cursor-default">
						<h4 className="nunito-font tw-capitalize tw-transition-all tw-duration-300 tw-ease-in-out tw-font-normal tw-w-full tw-px-3 tw-text-center tw-text-white tw-text-xl lg:tw-text-2xl tw-cursor-default group-hover:tw-scale-125">
							{activity?.name}
						</h4>
					</div>
					<BlurImage
						src={activity?.image}
						alt={activity?.alt}
						width={0}
						height={0}
						layout="fill"
						objectFit="cover"
						className="tw-rounded-lg tw-cursor-pointer tw-transition-all tw-duration-300 tw-ease-in-out group-hover:tw-scale-125 group-hover:tw-rotate-6"
					/>
				</div>
			))}
		</div>
	);
};

export default ActivitiesGrid;
