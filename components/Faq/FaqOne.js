import React from 'react';
import Accordion from '../Accordion';
import { questionsAnswers } from 'data/faqData';

const FaqOne = ({ searchValue = null, reset }) => {
	return (
		<div className="faq-area bg-f1f5fd pb-100">
			<div className="container">
				<div className="faq-accordion-content">
					<div className="box">
						<div className="tw-w-full tw-flex tw-justify-between tw-items-start">
							<h3>Getting Started</h3>
							{searchValue && (
								<button
									className="tw-transition-all tw-duration-500 tw-ease-in-out tw-text-white tw-bg-red-500 hover:tw-shadow-md hover:tw-shadow-red-500/40 tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium"
									onClick={() => reset()}
									type="button">
									Reset
								</button>
							)}
						</div>
						<div className="accordion" id="faqAccordion">
							<Accordion
								questionsAnswers={
									searchValue
										? questionsAnswers?.filter((value) =>
												value?.question
													?.toLowerCase()
													.includes(searchValue?.toLowerCase())
										  )
										: questionsAnswers
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FaqOne;
