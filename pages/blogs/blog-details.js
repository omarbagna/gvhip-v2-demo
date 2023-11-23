import React from 'react';
import Navbar from '@/components/Layout/Navigations/Navbar4';
import DetailsContent from '@/components/Blog/BlogDetails/DetailsContent';
import FooterFour from '@/components/Layout/Footer/FooterFour';

const BlogDetails = () => {
	return (
		<>
			<Navbar />
			<div className="page-title-area">
				<div className="container">
					<div className="page-title-content">
						<span className="sub-title green-color">Blog Details</span>
						<h1>How our company works in different ways</h1>
					</div>
				</div>
			</div>
			<DetailsContent />
			<FooterFour />
		</>
	);
};

export default BlogDetails;
