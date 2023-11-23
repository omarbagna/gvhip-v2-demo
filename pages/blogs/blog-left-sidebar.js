import React from 'react';
import Navbar from '@/components/Layout/Navigations/Navbar4';
import LeftSidebarContent from '@/components/Blog/LeftSidebarContent';
import FooterFour from '@/components/Layout/Footer/FooterFour';

const BlogLeftSidebar = () => {
	return (
		<>
			<Navbar />
			<div className="page-title-area">
				<div className="container">
					<div className="page-title-content">
						<span className="sub-title red-light-color">Blog left sidebar</span>
						<h1>Our latest articles & resources</h1>
					</div>
				</div>
			</div>
			<LeftSidebarContent />
			<FooterFour />
		</>
	);
};

export default BlogLeftSidebar;
