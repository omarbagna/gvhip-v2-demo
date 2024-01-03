import React from 'react';
import Navbar4 from '@/components/Layout/Navigations/Navbar4';
import FooterFour from '@/components/Layout/Footer/FooterFour';
import AttractionsBanner from '@/components/TouristAttractions/AttractionsBanner';
import { useQuery } from 'react-query';
import AttractionsGrid from '@/components/TouristAttractions/AttractionsGrid';
import baseUrl from '@/utils/baseUrl';
import axios from 'axios';

const TouristSites = () => {
	const getTouristAttractions = async () => {
		const url = `${baseUrl}/api/tourist-attractions`;

		const response = await axios.get(url);

		return response;
	};

	const touristAttractions = useQuery('attractions', getTouristAttractions, {
		onError: async (error) => {
			console.log(error);
		},
	});

	const ATTRACTIONS = touristAttractions?.data?.data
		? touristAttractions?.data?.data
		: null;

	return (
		<>
			<Navbar4 />
			<AttractionsBanner attractions={ATTRACTIONS} />
			<div className="tw-w-full tw-py-14 md:tw-py-24 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4">
				<div className="tw-w-full tw-px-8 lg:tw-px-14 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-6">
					<h3 className="tw-capitalize tw-text-2xl lg:tw-text-4xl tw-w-full tw-text-center tw-font-medium">
						list of tourist attractions in ghana
					</h3>

					<AttractionsGrid attractions={ATTRACTIONS} />
				</div>
			</div>
			<FooterFour />
		</>
	);
};

export default TouristSites;
