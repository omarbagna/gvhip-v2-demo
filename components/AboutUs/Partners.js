import React from 'react';

import partnerImg1 from '@/public/images/partner/partner1.png';
import partnerImg2 from '@/public/images/partner/partner2.png';
import partnerImg3 from '@/public/images/partner/partner3.png';
import partnerImg4 from '@/public/images/partner/partner4.png';
import BlurImage from '../BlurImage/BlurImage';

const Partners = () => {
	return (
		<div className="partner-area pt-100">
			<div className="container">
				<div className="row align-items-center">
					<div className="col-lg-4 col-md-12">
						<div className="partner-title">
							Trusted by world famous companies:
						</div>
					</div>
					<div className="col-lg-8 col-md-12">
						<div className="partner-item-lists">
							<div className="row align-items-center">
								<div className="col-lg-3 col-md-3 col-sm-3 col-6">
									<div className="partner-item">
										<BlurImage src={partnerImg1} alt="partner-image" />
									</div>
								</div>
								<div className="col-lg-3 col-md-3 col-sm-3 col-6">
									<div className="partner-item">
										<BlurImage src={partnerImg2} alt="partner-image" />
									</div>
								</div>
								<div className="col-lg-3 col-md-3 col-sm-3 col-6">
									<div className="partner-item">
										<BlurImage src={partnerImg3} alt="partner-image" />
									</div>
								</div>
								<div className="col-lg-3 col-md-3 col-sm-3 col-6">
									<div className="partner-item">
										<BlurImage src={partnerImg4} alt="partner-image" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Partners;
