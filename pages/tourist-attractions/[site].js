import { useRouter } from 'next/router';
import React from 'react';
import Navbar4 from '@/components/Layout/Navigations/Navbar4';
import FooterFour from '@/components/Layout/Footer/FooterFour';
import SiteBanner from '@/components/TouristSite/SiteBanner';
import Link from 'next/link';
import { AiOutlinePhone } from 'react-icons/ai';
import { TbWorldWww } from 'react-icons/tb';
import ActivitiesGrid from '@/components/TouristSite/ActivitiesGrid';
import { useQuery } from 'react-query';
import axios from 'axios';
import baseUrl from '@/utils/baseUrl';

const Site = () => {
	const router = useRouter();
	const location = router.query;

	const getTouristAttraction = async () => {
		const url = `${baseUrl}/api/single-tourist-attraction`;
		const payload = { site: location?.site };

		const response = await axios.post(url, payload);

		return response;
	};

	const touristAttraction = useQuery(
		['attraction', location?.site],
		getTouristAttraction,
		{
			onError: async (error) => {
				console.log(error);
			},

			enabled: !!location?.site,
		}
	);

	const ATTRACTION = touristAttraction?.data?.data
		? touristAttraction?.data?.data
		: null;

	return (
		<>
			<Navbar4 />
			<SiteBanner
				name={ATTRACTION?.name}
				alt={ATTRACTION?.alt}
				image={ATTRACTION?.image}
			/>
			<div className="tw-w-full tw-py-14 md:tw-py-24 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4">
				<div className="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-text-xs tw-py-1 tw-px-5 tw-rounded-full tw-bg-[#FFECF4] tw-text-[#8D69BF] tw-font-medium">
					<Link href="/">
						<a className="hover:tw-text-[#8D69BF]">Home</a>
					</Link>
					/
					<Link href="/tourist-attractions">
						<a className="hover:tw-text-[#8D69BF]">Tourist Attractions</a>
					</Link>
					/<span className="tw-capitalize">{location?.site}</span>
				</div>
				<div className="tw-w-full tw-px-8 lg:tw-px-14 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-6">
					<h3 className="tw-capitalize tw-text-2xl lg:tw-text-4xl tw-w-full tw-text-center tw-font-medium">
						Welcome to the {ATTRACTION?.name}
					</h3>
					<p
						data-aos="fade-up"
						data-aos-duration="1200"
						className="lg:tw-w-2/3 tw-text-center tw-text-base lg:tw-text-lg">
						{ATTRACTION?.desc}
						<br className="tw-hidden lg:tw-block" /> Here are some things
						tourists can do at{' '}
						<strong className="tw-capitalize tw-font-normal">
							{ATTRACTION?.name}
						</strong>
						:
					</p>

					<ActivitiesGrid activities={ATTRACTION?.activities} />

					<p
						data-aos="fade-up"
						data-aos-duration="1200"
						className="lg:tw-w-2/3 tw-text-center tw-text-base lg:tw-text-lg">
						Before visiting{' '}
						<strong className="tw-capitalize tw-font-normal">
							{ATTRACTION?.name}
						</strong>
						, it&apos;s advisable to check for any updated regulations, entry
						fees, and guided tour options. Additionally, hiring a knowledgeable
						guide is often recommended to enhance your viewing and overall
						experience.
					</p>
					<div className="tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-1">
						<p
							data-aos="fade-up"
							data-aos-duration="1200"
							className="lg:tw-w-2/3 tw-text-center tw-text-base lg:tw-text-lg">
							For booking and enquiries contact{' '}
							<strong className="tw-capitalize tw-font-normal">
								{ATTRACTION?.name}
							</strong>{' '}
							with the information below:
						</p>

						<div
							data-aos="fade-up"
							data-aos-duration="1200"
							className="tw-w-fit tw-flex tw-flex-col md:tw-flex-row tw-items-start tw-justify-center md:tw-items-center tw-gap-3 md:tw-gap-6 tw-shrink-0">
							{ATTRACTION?.phone ? (
								<a
									href={`tel:${ATTRACTION?.phone}`}
									className="tw-group tw-flex tw-justify-center tw-items-center tw-shrink-0 tw-gap-2 tw-text-[#8D69BF] hover:tw-text-[#8D69BF] tw-text-base">
									<span className="tw-transition-all tw-duration-200 tw-ease-in-out tw-p-1 tw-rounded-md tw-bg-[#FFECF4] tw-text-[#8D69BF] group-hover:tw-bg-[#8D69BF] group-hover:tw-text-white">
										<AiOutlinePhone className="tw-text-2xl" />
									</span>{' '}
									{ATTRACTION?.phone}
								</a>
							) : null}

							{ATTRACTION?.website ? (
								<a
									href={ATTRACTION?.website}
									target="_blank"
									rel="noreferrer"
									className="tw-group tw-flex tw-justify-center tw-items-center tw-shrink-0 tw-gap-2 tw-text-[#8D69BF] hover:tw-text-[#8D69BF] tw-text-base">
									<span className="tw-transition-all tw-duration-200 tw-ease-in-out tw-p-1 tw-rounded-md tw-bg-[#FFECF4] tw-text-[#8D69BF] group-hover:tw-bg-[#8D69BF] group-hover:tw-text-white">
										<TbWorldWww className="tw-text-2xl" />
									</span>{' '}
									Official website
								</a>
							) : null}
						</div>
					</div>
				</div>
			</div>
			<FooterFour />
		</>
	);
};

export default Site;
