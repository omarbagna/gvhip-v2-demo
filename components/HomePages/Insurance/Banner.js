import React from 'react';
import Link from 'next/link';

import bannerImg4 from '@/public/images/banner/banner4.webp';
import kakum from '@/public/images/kakum.jpg';
import elmina from '@/public/images/elmina.jpg';
import mole from '@/public/images/mole.webp';
import boti from '@/public/images/boti.jpeg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, A11y, EffectCreative, Navigation } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/navigation';
import BlurImage from '@/components/BlurImage/BlurImage';

const attractions = [
	{
		id: 1,
		name: 'map with passport',
		image:
			'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&q=80&w=3006&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'map with passport',
	},
	{
		id: 2,
		name: 'departure',
		image:
			'https://images.unsplash.com/photo-1522199873717-bc67b1a5e32b?auto=format&fit=crop&q=80&w=2944&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'departure',
	},
	{
		id: 3,
		name: 'beach',
		image:
			'https://images.unsplash.com/photo-1583108607572-a8c0bfc741fd?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'beach',
	},
];

const Banner = () => {
	return (
		<div className="insurance-banner-area">
			<div className="container-fluid">
				<div className="row align-items-center justify-content-center  tw-h-fit">
					<div className="col-lg-6 col-md-12">
						<div className="insurance-banner-content">
							<h1
								data-aos="fade-up"
								data-aos-duration="1200"
								className="nunito-font">
								Welcome to the <br className="tw-hidden lg:tw-block" />
								Ghana Visitors Health Insurance Platform
							</h1>
							<span
								className="sub-title lg:!tw-text-xl"
								data-aos="fade-up"
								data-aos-duration="1200"
								data-aos-delay="100">
								Your Path to a Seamless, Safe, and Medically Secure Trip.
							</span>
							<p
								data-aos="fade-up"
								data-aos-duration="1200"
								className="lg:!tw-text-lg"
								data-aos-delay="200">
								The Ghana Visitors Health Insurance Platform (GVHIP) ensures
								that you have a seamless, safe, and medically secure trip within
								our beautiful country.
							</p>
							<p
								data-aos="fade-up"
								data-aos-duration="1200"
								data-aos-delay="300">
								Ghana welcomes you with open arms!
							</p>
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

								<Link href="/about-us-2">
									<a className="btn-style-one white-color">
										About Us <i className="bx bx-chevron-right"></i>
									</a>
								</Link>
							</div>
						</div>
					</div>

					<div className="col-lg-6 col-md-12 ">
						<Swiper
							spaceBetween={25}
							centeredSlides={true}
							effect={'creative'}
							creativeEffect={{
								prev: {
									shadow: true,
									translate: [0, 0, -400],
								},
								next: {
									translate: ['100%', 0, 0],
								},
							}}
							pagination={{
								clickable: true,
							}}
							autoplay={{
								delay: 5000,
								pauseOnMouseEnter: false,
								disableOnInteraction: false,
							}}
							loop={true}
							className="[&_.swiper-pagination-bullet-active]:tw-bg-[#8e6abf] tw-flex tw-flex-col tw-gap-4 tw-justify-center tw-items-center"
							modules={[
								Pagination,
								Autoplay,
								A11y,
								EffectCreative,
								Navigation,
							]}>
							{attractions.map((attraction, index) => (
								<SwiperSlide key={index}>
									<div className="tw-group tw-relative tw-w-full tw-h-[50vh] tw-mt-10 lg:tw-mt-0 lg:tw-h-[60vh] tw-overflow-hidden tw-rounded-lg">
										<BlurImage
											src={attraction.image}
											alt={attraction.alt}
											width={0}
											height={0}
											layout="fill"
											objectFit="cover"
											className="tw-rounded-lg group-hover:tw-scale-125"
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Banner;
