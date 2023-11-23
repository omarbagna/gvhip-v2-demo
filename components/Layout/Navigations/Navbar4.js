'use client';

import React from 'react';
import Link from '@/utils/ActiveLink';

import logo from '@/public/images/gsti_logo.jpeg';
import ministryLogo from '@/public/images/ministry-logo.png';
import immigrationLogo from '@/public/images/GIS-LOGO.jpg';
import ghsLogo from '@/public/images/ghs.jpg';
import airlinesLogo from '@/public/images/ghana-airlines.gif';
import { signIn, useSession } from 'next-auth/react';
import { Skeleton } from '@mui/material';
import ReactFlagsSelect from 'react-flags-select';
import { AiOutlineClose } from 'react-icons/ai';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import BlurImage from '@/components/BlurImage/BlurImage';

const agencies = [
	{
		id: 'ministries',
		name: 'Ministry of Foreign Affairs',
		logo: ministryLogo,
		alt: 'ministry logo',
		url: '/login/ministry',
	},
	{
		id: 'immigration',
		name: 'Ghana Immigration Service',
		logo: immigrationLogo,
		alt: 'immigration logo',
		url: '/login/immigration',
	},
	{
		id: 'porthealth',
		name: 'Ghana Port Health Services (GHS)',
		logo: ghsLogo,
		alt: 'port health logo',
		url: '/login/ghs',
	},
	{
		id: 'airlines',
		name: 'Ghana Airlines',
		logo: airlinesLogo,
		alt: 'airlines logo',
		url: '/policy-check',
	},
];

const Navbar4 = () => {
	const { data: session, status } = useSession();

	const [menu, setMenu] = React.useState(true);
	const [showAgencyModal, setShowAgencyModal] = React.useState(false);
	const [selected, setSelected] = React.useState('US');
	const toggleNavbar = () => {
		setMenu(!menu);
	};
	React.useEffect(() => {
		let elementId = document.getElementById('navbar');
		document.addEventListener('scroll', () => {
			if (window.scrollY > 170) {
				elementId.classList.add('is-sticky');
			} else {
				elementId.classList.remove('is-sticky');
			}
		});
	});

	React.useEffect(() => {
		var addScript = document.createElement('script');
		addScript.setAttribute(
			'src',
			'//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
		);
		document.body.appendChild(addScript);
		window.googleTranslateElementInit = googleTranslateElementInit;

		if (hasCookie('googtrans')) {
			setSelected(getCookie('googtrans'));
		} else {
			setSelected('/auto/en');
		}
	}, []);

	const googleTranslateElementInit = () => {
		new window.google.translate.TranslateElement(
			{
				pageLanguage: 'auto',
				autoDisplay: false,
				includedLanguages: 'en,fr,de', // If you remove it, by default all google supported language will be included
				layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
			},
			'google_translate_element'
		);
	};

	const langChange = (code) => {
		console.log(code);
		if (hasCookie('googtrans')) {
			setCookie('googtrans', decodeURI(`/auto/${code}`));
			setSelected(code);
		} else {
			setCookie('googtrans', `/auto/${code}`);
			setSelected(`/auto/${code}`);
		}
		window.location.reload();
	};

	const classOne = menu
		? 'collapse navbar-collapse mean-menu'
		: 'collapse navbar-collapse show';
	const classTwo = menu
		? 'navbar-toggler navbar-toggler-right collapsed'
		: 'navbar-toggler navbar-toggler-right';

	return (
		<>
			<div id="navbar" className="navbar-area">
				<div className="main-nav">
					<div className="container-fluid">
						<nav className="tw-relative navbar navbar-expand-lg navbar-light bg-light">
							<Link href="/">
								<a className="navbar-brand p-1">
									<BlurImage src={logo} alt="site logo" className="rounded-2" />
								</a>
							</Link>
							<div className="tw-absolute tw-top-6 -tw-translate-y-1/2 tw-left-16 tw-h-fit lg:tw-hidden tw-mr-8 tw-w-fit">
								<ReactFlagsSelect
									countries={[
										'GB',
										'FR',
										'DE',
										//, 'IT'
									]}
									customLabels={{
										GB: 'EN',
										FR: 'FR',
										DE: 'DE',
										//IT: 'IT',
									}}
									placeholder="Select language"
									className="tw-mt-2"
									selected={selected.replace('/auto/', '').toUpperCase()}
									onSelect={(code) => langChange(code.toLocaleLowerCase())}
								/>
							</div>

							<button
								onClick={toggleNavbar}
								className={classTwo}
								type="button"
								data-toggle="collapse"
								data-target="#navbarSupportedContent"
								aria-controls="navbarSupportedContent"
								aria-expanded="false"
								aria-label="Toggle navigation">
								<span className="icon-bar top-bar"></span>
								<span className="icon-bar middle-bar"></span>
								<span className="icon-bar bottom-bar"></span>
							</button>

							<div className={classOne} id="navbarSupportedContent">
								<ul className="navbar-nav">
									<li className="nav-item">
										<Link href="/" activeClassName="active">
											<a className="nav-link">Home</a>
										</Link>
									</li>

									<li className="nav-item">
										<Link href="/about-us-2" activeClassName="active">
											<a className="nav-link">About Us</a>
										</Link>
										{/**
										<ul className="dropdown-menu">
											<li className="nav-item">
												<a href="#" className="dropdown-toggle nav-link">
													About Us
												</a>
												<ul className="dropdown-menu">
													<li className="nav-item">
														<Link href="/about-us" activeClassName="active">
															<a className="nav-link">IT Startup</a>
														</Link>
													</li>
													<li className="nav-item">
														<Link href="/about-us-2" activeClassName="active">
															<a className="nav-link">Insurance</a>
														</Link>
													</li>
												</ul>
											</li>
											<li className="nav-item">
												<Link href="/team" activeClassName="active">
													<a className="nav-link">Team</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/testimonials" activeClassName="active">
													<a className="nav-link">Testimonials</a>
												</Link>
											</li>
											<li className="nav-item">
												<a href="#" className="dropdown-toggle nav-link">
													Courses
												</a>
												<ul className="dropdown-menu">
													<li className="nav-item">
														<Link href="/courses" activeClassName="active">
															<a className="nav-link">Courses</a>
														</Link>
													</li>
													<li className="nav-item">
														<Link
															href="/courses/courses-details"
															activeClassName="active">
															<a className="nav-link">Courses Details</a>
														</Link>
													</li>
												</ul>
											</li>
											<li className="nav-item">
												<Link href="/pricing" activeClassName="active">
													<a className="nav-link">Pricing</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/features" activeClassName="active">
													<a className="nav-link">Features</a>
												</Link>
											</li>
											<li className="nav-item">
												<a href="#" className="dropdown-toggle nav-link">
													Services
												</a>
												<ul className="dropdown-menu">
													<li className="nav-item">
														<Link
															href="/services/services"
															activeClassName="active">
															<a className="nav-link">Services Style 01</a>
														</Link>
													</li>
													<li className="nav-item">
														<Link
															href="/services/services-2"
															activeClassName="active">
															<a className="nav-link">Services Style 02</a>
														</Link>
													</li>
													<li className="nav-item">
														<Link
															href="/services/services-3"
															activeClassName="active">
															<a className="nav-link">Services Style 03</a>
														</Link>
													</li>
													<li className="nav-item">
														<Link
															href="/services/services-4"
															activeClassName="active">
															<a className="nav-link">Services Style 04</a>
														</Link>
													</li>
													<li className="nav-item">
														<Link
															href="/services/services-details"
															activeClassName="active">
															<a className="nav-link">Services Details</a>
														</Link>
													</li>
												</ul>
											</li>
											<li className="nav-item">
												<Link href="/authentication" activeClassName="active">
													<a className="nav-link">Login/Register</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/lost-password" activeClassName="active">
													<a className="nav-link">Forgot Password</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/faq" activeClassName="active">
													<a className="nav-link">FAQ</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/privacy-policy" activeClassName="active">
													<a className="nav-link">Privacy Policy</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/terms-conditions" activeClassName="active">
													<a className="nav-link">Terms & Conditions</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/coming-soon" activeClassName="active">
													<a className="nav-link">Coming Soon</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/404" activeClassName="active">
													<a className="nav-link">404 Error Page</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/thank-you" activeClassName="active">
													<a className="nav-link">Thank You</a>
												</Link>
											</li>
										</ul>
									 */}
									</li>
									<li className="nav-item">
										<Link href="/tourist-attractions" activeClassName="active">
											<a className="nav-link">Tourist Attractions</a>
										</Link>
									</li>
									<li className="nav-item">
										<Link href="#">
											<a className="dropdown-toggle nav-link">Learn</a>
										</Link>
										<ul className="dropdown-menu">
											<li className="nav-item">
												<Link href="/pricing" activeClassName="active">
													<a className="nav-link">Plans</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/blogs/blog-grid" activeClassName="active">
													<a className="nav-link">Blog</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/blogs/blog-grid" activeClassName="active">
													<a className="nav-link">Knowledge Center</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/blogs/blog-grid" activeClassName="active">
													<a className="nav-link">Learn About Claims</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/faq" activeClassName="active">
													<a className="nav-link">FAQ</a>
												</Link>
											</li>
										</ul>
									</li>
									<li className="nav-item">
										<Link href="#">
											<a className="dropdown-toggle nav-link">Support</a>
										</Link>
										<ul className="dropdown-menu">
											<li className="nav-item">
												<Link
													href="/policy-holder/manage-policy"
													activeClassName="active">
													<a className="nav-link">Manage your Policy</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/authentication" activeClassName="active">
													<a className="nav-link">Find Doctors & Hospitals</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link
													href="/form/purchase-plan"
													activeClassName="active">
													<a className="nav-link">Request a Quote</a>
												</Link>
											</li>
											<li className="nav-item">
												<Link href="/contact" activeClassName="active">
													<a className="nav-link">Contact Us</a>
												</Link>
											</li>
										</ul>
									</li>

									{status === 'authenticated' && session ? null : status ===
											'unauthenticated' && !session ? (
										<li className="nav-item">
											<Link href="#">
												<a className="dropdown-toggle nav-link">Sign In</a>
											</Link>
											<ul className="dropdown-menu lg:!tw-w-fit">
												<li className="nav-item">
													<span
														className="tw-cursor-pointer"
														onClick={() => signIn()}>
														<a className="nav-link">Policy Holder Sign in</a>
													</span>
												</li>
												<li className="nav-item">
													<span //href="/agency-login"
														className="tw-cursor-pointer"
														onClick={() => {
															toggleNavbar();
															setShowAgencyModal(true);
														}}>
														<a className="nav-link">Agency Sign in</a>
													</span>
												</li>
											</ul>
										</li>
									) : (
										status === 'loading' && (
											<div className="others-option">
												<Skeleton
													variant="text"
													sx={{ fontSize: '2rem', width: '100px' }}
												/>
											</div>
										)
									)}
								</ul>
							</div>

							{status === 'authenticated' && session ? (
								<div className="others-option">
									<Link href="/policy-holder" activeClassName="active">
										<a className="btn-style-one crimson-color tw-cursor-pointer">
											Dashboard
										</a>
									</Link>
								</div>
							) : status === 'unauthenticated' && !session ? null : (
								status === 'loading' && (
									<div className="others-option">
										<Skeleton
											variant="text"
											sx={{ fontSize: '2rem', width: '100px' }}
										/>
									</div>
								)
							)}

							<div className="tw-hidden lg:tw-block tw-ml-5 tw-w-fit">
								<div id="google_translate_element" className="tw-hidden"></div>
								<ReactFlagsSelect
									countries={[
										'GB',
										'FR',
										'DE',
										//, 'IT'
									]}
									customLabels={{
										GB: 'EN',
										FR: 'FR',
										DE: 'DE',
										//IT: 'IT',
									}}
									placeholder="Select language"
									className="tw-mt-2"
									selected={selected.replace('/auto/', '').toUpperCase()}
									onSelect={(code) => langChange(code.toLocaleLowerCase())}
								/>
							</div>
						</nav>
					</div>
				</div>
			</div>

			{showAgencyModal && (
				<div
					className="tw-fixed tw-top-0 tw-left-0 tw-z-[999] tw-w-screen tw-h-screen tw-bg-black/20 tw-backdrop-blur-sm tw-flex tw-justify-center tw-items-center"
					onClick={() => setShowAgencyModal(false)}>
					<div
						data-aos="zoom-in"
						data-aos-duration="800"
						className="tw-rounded-xl tw-bg-white tw-w-full md:tw-w-4/5 lg:tw-w-1/2 xl:tw-w-1/3 tw-h-fit tw-px-5 tw-py-10 tw-flex tw-flex-col overflow-auto"
						onClick={(e) => e.stopPropagation()}>
						<div className="section-title !tw-w-full !tw-max-w-full tw-flex tw-justify-between tw-items-center">
							<h2 className="nunito-font">Select Agency</h2>

							<span
								className="md:tw-hidden tw-cursor-pointer btn-style-back crimson-color tw-rounded-full tw-flex tw-justify-center tw-items-center tw-w-8 tw-h-8 md:tw-w-12 md:tw-h-12 tw-p-2"
								onClick={() => setShowAgencyModal(false)}>
								<AiOutlineClose className="tw-text-xl md:tw-text-3xl" />
							</span>
						</div>

						<div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2 md:tw-gap-4">
							{agencies?.map((agency) => (
								<Link key={agency?.id} href={agency?.url}>
									<div className="tw-group tw-transition-all tw-duration-500 tw-ease-in-out tw-w-full tw-h-fit tw-rounded-lg tw-py-2 tw-px-5 tw-border-2 tw-border-[#8e6abf] hover:tw-bg-gradient-to-tl hover:tw-from-[#8e6abf]/70 hover:tw-to-[#7e3ed8]/70 tw-flex tw-justify-center tw-items-center tw-gap-3 tw-cursor-pointer">
										<div className="tw-w-full tw-flex tw-flex-row-reverse tw-justify-start tw-items-center tw-gap-3">
											<span
												className={`tw-cursor-pointer tw-shrink-0 tw-transition-all tw-duration-300 tw-ease-in-out group-hover:tw-scale-105 tw-h-fit tw-rounded-xl tw-w-fit tw-flex tw-justify-center tw-items-center ${
													agency?.id === 'ministries' ? 'tw-bg-black' : ''
												} tw-p-1`}>
												<BlurImage
													src={agency?.logo}
													alt={agency?.alt}
													width={agency?.id === 'ministries' ? 120 : 60}
													height={agency?.id === 'ministries' ? 50 : 60}
													className="rounded-2"
												/>
											</span>
											<p className="tw-w-full tw-text-base md:tw-text-lg tw-text-left tw-cursor-pointer group-hover:tw-text-white">
												{agency?.name}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Navbar4;
