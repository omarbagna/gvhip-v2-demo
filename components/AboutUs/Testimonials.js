import React from 'react';
import { Carousel } from 'react-responsive-carousel';

import clientImg1 from '@/public/images/clients/client1.png';
import clientImg2 from '@/public/images/clients/client2.png';
import clientImg3 from '@/public/images/clients/client3.png';
import clientImg4 from '@/public/images/clients/client4.png';
import clientImg5 from '@/public/images/clients/client5.png';

import userImg1 from '@/public//images/user/user1.jpg';
import userImg2 from '@/public//images/user/user2.jpg';
import userImg3 from '@/public//images/user/user3.jpg';
import userImg4 from '@/public//images/user/user4.jpg';
import userImg5 from '@/public//images/user/user5.jpg';
import BlurImage from '../BlurImage/BlurImage';

const Testimonials = () => {
	const renderCustomThumbs = () => {
		return [
			<div key="01" className="owl-thumb-item">
				<div className="item">
					<BlurImage src={clientImg1} alt="First Thumbnail" />
				</div>
			</div>,
			<div key="02" className="owl-thumb-item">
				<div className="item">
					<BlurImage src={clientImg2} alt="Second Thumbnail" />
				</div>
			</div>,
			<div key="03" className="owl-thumb-item">
				<div className="item">
					<BlurImage src={clientImg3} alt="Third Thumbnail" />
				</div>
			</div>,
			<div key="04" className="owl-thumb-item">
				<div className="item">
					<BlurImage src={clientImg4} alt="Fourth Thumbnail" />
				</div>
			</div>,
			<div key="05" className="owl-thumb-item">
				<div className="item">
					<BlurImage src={clientImg5} alt="Fifth Thumbnail" />
				</div>
			</div>,
		];
	};
	return (
		<div className="testimonials-area bg-1d2b53 ptb-100">
			<div className="container">
				<div className="section-title white-color">
					<span className="sub-title">Testimonials</span>
					<h2>Here’s what our amazing clients are saying</h2>
				</div>
				<div className="testimonials-slides">
					<Carousel
						showArrows={false}
						showIndicators={false}
						autoPlay={false}
						infiniteLoop={false}
						emulateTouch={true}
						showThumbs={true}
						renderThumbs={renderCustomThumbs}>
						<div className="single-testimonials-item">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna
								facilisi viverra felis eleifend ornare urna. Eu mauris, velit
								volutpat massa volutpat. Risus pellentesque felis nisl ut
								laoreet euismod vel, integer. Massa sodales lorem nisi, sed.
								Feugiat eu lacus, tortor egestas ut aenean. Est mauris pulvinar
								at vulputate.
							</p>
							<div className="client-info d-flex align-items-center justify-content-center">
								<BlurImage src={userImg1} alt="user" />
								<div className="info">
									<h3>Lora Joly</h3>
									<span>Founder at Envato</span>
								</div>
							</div>
						</div>
						<div className="single-testimonials-item">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna
								facilisi viverra felis eleifend ornare urna. Eu mauris, velit
								volutpat massa volutpat. Risus pellentesque felis nisl ut
								laoreet euismod vel, integer. Massa sodales lorem nisi, sed.
								Feugiat eu lacus, tortor egestas ut aenean. Est mauris pulvinar
								at vulputate.
							</p>
							<div className="client-info d-flex align-items-center justify-content-center">
								<BlurImage src={userImg2} alt="user" />
								<div className="info">
									<h3>Lora Joly</h3>
									<span>Founder at Envato</span>
								</div>
							</div>
						</div>
						<div className="single-testimonials-item">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna
								facilisi viverra felis eleifend ornare urna. Eu mauris, velit
								volutpat massa volutpat. Risus pellentesque felis nisl ut
								laoreet euismod vel, integer. Massa sodales lorem nisi, sed.
								Feugiat eu lacus, tortor egestas ut aenean. Est mauris pulvinar
								at vulputate.
							</p>
							<div className="client-info d-flex align-items-center justify-content-center">
								<BlurImage src={userImg3} alt="user" />
								<div className="info">
									<h3>Lora Joly</h3>
									<span>Founder at Envato</span>
								</div>
							</div>
						</div>
						<div className="single-testimonials-item">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna
								facilisi viverra felis eleifend ornare urna. Eu mauris, velit
								volutpat massa volutpat. Risus pellentesque felis nisl ut
								laoreet euismod vel, integer. Massa sodales lorem nisi, sed.
								Feugiat eu lacus, tortor egestas ut aenean. Est mauris pulvinar
								at vulputate.
							</p>
							<div className="client-info d-flex align-items-center justify-content-center">
								<BlurImage src={userImg4} alt="user" />
								<div className="info">
									<h3>Lora Joly</h3>
									<span>Founder at Envato</span>
								</div>
							</div>
						</div>
						<div className="single-testimonials-item">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna
								facilisi viverra felis eleifend ornare urna. Eu mauris, velit
								volutpat massa volutpat. Risus pellentesque felis nisl ut
								laoreet euismod vel, integer. Massa sodales lorem nisi, sed.
								Feugiat eu lacus, tortor egestas ut aenean. Est mauris pulvinar
								at vulputate.
							</p>
							<div className="client-info d-flex align-items-center justify-content-center">
								<BlurImage src={userImg5} alt="user" />
								<div className="info">
									<h3>Lora Joly</h3>
									<span>Founder at Envato</span>
								</div>
							</div>
						</div>
					</Carousel>
				</div>
			</div>
		</div>
	);
};

export default Testimonials;
