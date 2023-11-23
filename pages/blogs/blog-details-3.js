import React from 'react';
import Navbar from '@/components/Layout/Navigations/Navbar4';
import DetailsContent3 from '@/components/Blog/BlogDetails/DetailsContent3';
import FooterFour from '@/components/Layout/Footer/FooterFour';

const BlogDetails2 = () => {
	return (
		<>
			<Navbar />
			<div className="page-title-area">
				<div className="container">
					<div className="page-title-content">
						<span className="sub-title red-light-color">Blog Details</span>
						<h1>How our company works in different ways</h1>
					</div>
				</div>
			</div>
			<DetailsContent3 />
			<FooterFour />
		</>
	);
};

export default BlogDetails2;
