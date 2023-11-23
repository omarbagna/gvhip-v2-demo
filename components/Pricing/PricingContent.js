import React from 'react';
import Link from 'next/link';
import DetailsTabs from '../Courses/Details/DetailsTabs';
import { IoAdd } from 'react-icons/io5';
import { BiMinus } from 'react-icons/bi';
import Accordion from '../Accordion';
import { plans } from 'data/plansData';
import { AiOutlineFilePdf } from 'react-icons/ai';

const PricingContent = () => {
	const [showMore, setShowMore] = React.useState(null);

	const handleShowDetails = (index) => {
		setShowMore((prev) => (prev === index ? null : index));
	};

	return (
		<div className="pricing-area bg-f1f5fd pb-75">
			<div className="container">
				<div className="row justify-content-center">
					{plans?.map((plan) => (
						<div
							key={plan.id}
							className="col-lg-4 col-md-6 tw-transition-all"
							data-aos="fade-up"
							data-aos-duration="1200">
							<div className="single-pricing-box">
								<h3>{plan?.name}</h3>
								<p>{plan?.coverage}</p>
								<div className="tw-w-full tw-flex tw-flex-col tw-items-start tw-mb-6">
									<div>
										{plan?.discount !== 0 ? (
											<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2">
												<div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-gap-5">
													<span>{plan?.discount}% off</span>
													<div className="tw-text-base tw-text-red-300">
														<s>
															{Intl.NumberFormat('en-US', {
																style: 'currency',
																currency: 'USD',
															}).format(plan?.price)}
														</s>
														<span className="tw-text-gray-400">/person</span>
													</div>
												</div>
												<div className="price">
													{Intl.NumberFormat('en-US', {
														style: 'currency',
														currency: 'USD',
													}).format(plan?.price - plan?.price / plan?.discount)}
													<span>/person</span>
												</div>
											</div>
										) : (
											<>
												<div className="tw-h-8" />
												<div className="price">
													{Intl.NumberFormat('en-US', {
														style: 'currency',
														currency: 'USD',
													}).format(plan?.price)}
													<span>/person</span>
												</div>
											</>
										)}
										<Link href="/contact">
											<a className="btn-style-one light-green-color">
												Purchase Plan <i className="bx bx-chevron-right"></i>
											</a>
										</Link>
									</div>

									<ul className="features-list">
										{plan?.features?.map((item, index) => (
											<li key={index}>
												<i className="flaticon-draw-check-mark"></i>
												{item}
											</li>
										))}
									</ul>
								</div>

								{showMore === plan?.id && (
									<>
										<div
											className="tw-hidden "
											data-aos="fade-up"
											data-aos-duration="1200">
											<DetailsTabs tabsData={plan?.tabsData} />
										</div>

										<div className="tw-block">
											<Accordion questionsAnswers={plan?.tabsData} />
										</div>
									</>
								)}

								<div
									onClick={() => handleShowDetails(plan.id)}
									className="tw-group tw-cursor-pointer tw-w-fit tw-flex tw-justify-start tw-items-center tw-gap-2 tw-border-t-2 tw-pt-2 tw-mt-6">
									<div className="tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-500 tw-ease-in-out tw-rounded-full tw-h-6 tw-w-6 tw-text-white tw-bg-[#8e6abf] group-hover:tw-shadow-lg group-hover:tw-shadow-[#8e6abf]/50">
										{showMore !== plan?.id ? (
											<IoAdd className="tw-text-base" />
										) : (
											<BiMinus className="tw-text-base" />
										)}
									</div>
									<p className="tw-font-bold tw-text-sm tw-text-[#8e6abf]">
										{showMore !== plan?.id ? 'Show details' : 'Hide details'}
									</p>
								</div>

								<a
									href="#"
									target="_blank"
									rel="noreferrer"
									className="tw-group tw-w-full tw-flex tw-justify-start tw-items-center tw-gap-1 tw-pb-3 tw-mt-8">
									<AiOutlineFilePdf />
									<p className="tw-font-bold !tw-text-sm tw-text-[#8e6abf] hover:tw-underline">
										Plan Brochure
									</p>
								</a>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PricingContent;
