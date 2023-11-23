import React from 'react';
import Accordion from '../Accordion';

import faqImg from '@/public/images/faq2.png';
import { questionsAnswers } from 'data/faqData';
import BlurImage from '../BlurImage/BlurImage';

const Faq = () => {
	return (
		<div className="faq-area ptb-100">
			<div className="container">
				<div className="section-title">
					<span className="sub-title dark-green-color">FAQ</span>
					<h2 className="nunito-font">Frequently Asked Question</h2>
				</div>
				<div className="row align-items-center justify-content-center">
					<div className="col-lg-10 col-md-12">
						<div className="faq-accordion">
							<div className="accordion" id="faqAccordion">
								<Accordion questionsAnswers={questionsAnswers} />
							</div>
						</div>
					</div>
					<div className="col-lg-6 col-md-12 tw-hidden">
						<div className="faq-image style-three" data-aos="fade-up">
							<BlurImage
								src={faqImg}
								alt="faq-image"
								className="tw-rounded-lg tw-overflow-hidden"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Faq;
