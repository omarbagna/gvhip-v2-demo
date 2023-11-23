import React, { useState } from 'react';
import AccordionItem from './AccordionItem';

const Accordion = ({ questionsAnswers }) => {
	const [activeIndex, setActiveIndex] = useState([0]);

	const handleExpand = (index) => {
		setActiveIndex((prev) =>
			prev.includes(index)
				? prev.filter((value) => value !== index)
				: [...prev, index]
		);
	};

	const renderedQuestionsAnswers = questionsAnswers.map((item, index) => {
		const showDescription = activeIndex.includes(index)
			? 'show-description'
			: '';
		const fontWeightBold = activeIndex.includes(index)
			? 'font-weight-bold'
			: '';
		const ariaExpanded = activeIndex.includes(index) ? 'true' : 'false';
		return (
			<AccordionItem
				key={index}
				showDescription={showDescription}
				fontWeightBold={fontWeightBold}
				ariaExpanded={ariaExpanded}
				item={item}
				index={index}
				onClick={() => {
					handleExpand(index);
				}}
			/>
		);
	});

	return (
		<div className="faq">
			<dl className="faq__list">{renderedQuestionsAnswers}</dl>
		</div>
	);
};

export default Accordion;
