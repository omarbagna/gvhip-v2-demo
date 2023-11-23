import React from 'react';
import Navbar from '@/components/Layout/Navigations/Navbar4';
import SearchResultPost from '@/components/Blog/SearchResultPost';
import FooterFour from '@/components/Layout/Footer/FooterFour';
import Link from 'next/link';

const BlogSearchResult = () => {
	return (
		<>
			<Navbar />
			<div className="page-title-area">
				<div className="container">
					<div className="page-title-content">
						<h1>Search result for: Design</h1>
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
							<li>Design</li>
						</ul>
					</div>
				</div>
			</div>
			<SearchResultPost />
			<FooterFour />
		</>
	);
};

export default BlogSearchResult;
