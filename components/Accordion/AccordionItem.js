import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

const AccordionItem = ({
	showDescription,
	ariaExpanded,
	fontWeightBold,
	item,
	index,
	onClick,
}) => (
	<div className="faq__question">
		<dt>
			<button
				aria-expanded={ariaExpanded}
				aria-controls={`faq${index + 1}_desc`}
				data-qa="faq__question-button"
				className={`faq__question-button ${fontWeightBold}`}
				type="button"
				onClick={onClick}>
				{item?.question || item?.name}
			</button>
		</dt>
		<dd>
			{item?.answer ? (
				<p
					id={`faq${index + 1}_desc`}
					data-qa="faq__desc"
					className={`faq__desc ${showDescription}`}>
					{item?.answer}
				</p>
			) : (
				item?.content && (
					<ul
						id={`faq${index + 1}_desc`}
						data-qa="faq__desc"
						className={`faq__desc ${showDescription}`}>
						{item?.content?.map((value, index) => (
							<li
								className="tw-mb-2 tw-pb-2 tw-text-sm tw-flex tw-justify-start tw-items-start tw-gap-2"
								key={index}>
								{item?.name === 'Benefits' ? (
									<BsCheckLg className="tw-text-lg tw-text-green-500 tw-shrink-0" />
								) : (
									<AiOutlineClose className="tw-text-lg tw-text-red-500 tw-shrink-0" />
								)}
								{value}
							</li>
						))}
					</ul>
				)
			)}
		</dd>
	</div>
);

export default AccordionItem;
