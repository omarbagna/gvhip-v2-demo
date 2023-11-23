import React from 'react';
import Navbar from '@/components/Layout/Navigations/Navbar4';
import CategoriePost from '@/components/Blog/CategoriePost';
import FooterFour from '@/components/Layout/Footer/FooterFour';
import Link from 'next/link';

const BlogCategories = () => {
	return (
		<>
			<Navbar />
			<div className="page-title-area">
				<div className="container">
					<div className="page-title-content">
						<h1>Category: Startup</h1>
						<ul>
							<li>
								<Link href="/">
									<a>Home</a>
								</Link>
							</li>
							<li>
								<Link href="/blogs/blog-grid">
									<a>Blog</a>
								</Link>
							</li>
							<li>Startup</li>
						</ul>
					</div>
				</div>
			</div>
			<CategoriePost />
			<FooterFour />
		</>
	);
};

export default BlogCategories;
