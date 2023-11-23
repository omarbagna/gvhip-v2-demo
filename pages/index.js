import React from 'react';
import Navbar4 from '@/components/Layout/Navigations/Navbar4';
import Banner from '@/components/HomePages/Insurance/Banner';
import Features from '@/components/HomePages/Insurance/Features';
import Partners from '@/components/HomePages/Insurance/Partners';
import Goal from '@/components/HomePages/Insurance/Goal';
import HowToApply from '@/components/HomePages/Insurance/HowToApply';
import Target from '@/components/HomePages/Insurance/Target';
import TouristAttractions from '@/components/HomePages/Insurance/TouristAttractions';

import Faq from '@/components/HomePages/Insurance/Faq';
//import JoinOurCommunity from '@/components/HomePages/Insurance/JoinOurCommunity';
import FooterFour from '@/components/Layout/Footer/FooterFour';

export default function Index() {
	return (
		<>
			<Navbar4 />
			<Banner />
			<Features />
			<Partners />
			<TouristAttractions />
			<Goal />
			<HowToApply />
			<Target />
			{/**

			<JoinOurCommunity />
    		*/}
			<Faq />
			<FooterFour />
		</>
	);
}
