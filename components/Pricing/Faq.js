import React from 'react';
import Accordion from '../Accordion';
import { questionsAnswers } from 'data/faqData';

const Faq = ({ data = null }) => {
	return (
		<div className="faq-area bg-f3feff ptb-100">
			<div className="container">
				<div className="section-title">
					<span className="sub-title">Pricing FAQ</span>
					<h2>Dedicated to help with all your needs</h2>
				</div>
				<div className="faq-accordion style-two">
					<div className="accordion" id="faqAccordion">
						<Accordion questionsAnswers={data ? data : questionsAnswers} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Faq;
