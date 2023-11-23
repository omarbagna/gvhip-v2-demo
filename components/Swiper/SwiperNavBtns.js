import React from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { useSwiper } from 'swiper/react';

export const SwiperNavButtons = () => {
	const swiper = useSwiper();

	return (
		<div className="tw-w-full tw-hidden md:tw-flex tw-justify-end tw-items-center tw-gap-5 tw-z-10">
			<div
				onClick={() => swiper.slidePrev()}
				className="tw-group tw-transition-all tw-duration-200 tw-ease-in-out tw-p-1 tw-rounded-md tw-bg-[#FFECF4] tw-text-[#8D69BF] hover:tw-bg-[#8D69BF] hover:tw-text-white tw-cursor-pointer">
				<MdNavigateBefore className="tw-text-2xl" />
			</div>
			<div
				onClick={() => swiper.slideNext()}
				className="tw-group tw-transition-all tw-duration-200 tw-ease-in-out tw-p-1 tw-rounded-md tw-bg-[#FFECF4] tw-text-[#8D69BF] hover:tw-bg-[#8D69BF] hover:tw-text-white tw-cursor-pointer">
				<MdNavigateNext className="tw-text-2xl" />
			</div>
		</div>
	);
};
