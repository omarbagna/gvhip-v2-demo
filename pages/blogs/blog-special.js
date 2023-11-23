import React from 'react';
import Navbar from '@/components/Layout/Navigations/Navbar4';
import SpecialContent from '@/components/Blog/SpecialContent';
import FooterFour from '@/components/Layout/Footer/FooterFour';

const BlogSpecial = () => {
	return (
		<>
			<Navbar />
			<div className="page-title-area">
				<div className="container">
					<div className="page-title-content">
						<span className="sub-title">Latest News</span>
						<h1>Our latest articles & resources</h1>
					</div>
				</div>
			</div>
			<SpecialContent />
			<FooterFour />
		</>
	);
};

export default BlogSpecial;
