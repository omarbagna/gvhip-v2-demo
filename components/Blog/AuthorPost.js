import React from 'react';
import Link from 'next/link';

import blogImg1 from '@/public/images/blog/blog1.jpg';
import blogImg2 from '@/public/images/blog/blog2.jpg';
import blogImg3 from '@/public/images/blog/blog3.jpg';
import blogImg4 from '@/public/images/blog/blog4.jpg';
import blogImg5 from '@/public/images/blog/blog5.jpg';
import blogImg6 from '@/public/images/blog/blog6.jpg';
import blogImg7 from '@/public/images/blog/blog7.jpg';
import blogImg8 from '@/public/images/blog/blog8.jpg';
import blogImg9 from '@/public/images/blog/blog9.jpg';
import BlurImage from '../BlurImage/BlurImage';

const AuthorPost = () => {
	return (
		<div className="blog-area ptb-100">
			<div className="container">
				<div className="row justify-content-center">
					<div
						className="col-xl-4 col-lg-6 col-md-6"
						data-aos="fade-up"
						data-aos-duration="1200">
						<div className="single-blog-post">
							<div className="image">
								<Link href="/blogs/blog-details">
									<a className="d-block">
										<BlurImage src={blogImg1} alt="blog-image" />
									</a>
								</Link>
							</div>
							<div className="content">
								<ul className="meta">
									<li>
										<i className="bx bx-purchase-tag-alt"></i>
										<Link href="/blogs/blog-tag">
											<a>Technology</a>
										</Link>
									</li>
									<li>
										<i className="bx bx-calendar-check"></i>
										25 Nov, 2021
									</li>
								</ul>
								<h3>
									<Link href="/blogs/blog-details">
										<a>How is technology working with new things?</a>
									</Link>
								</h3>
							</div>
						</div>
					</div>

					<div
						className="col-xl-4 col-lg-6 col-md-6"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="100">
						<div className="single-blog-post">
							<div className="image">
								<Link href="/blogs/blog-details">
									<a className="d-block">
										<BlurImage src={blogImg2} alt="blog-image" />
									</a>
								</Link>
							</div>
							<div className="content">
								<ul className="meta">
									<li>
										<i className="bx bx-purchase-tag-alt"></i>
										<Link href="/blogs/blog-tag">
											<a>Design</a>
										</Link>
									</li>
									<li>
										<i className="bx bx-calendar-check"></i>
										24 Nov, 2021
									</li>
								</ul>
								<h3>
									<Link href="/blogs/blog-details">
										<a>Top 10 important tips on IT services & design</a>
									</Link>
								</h3>
							</div>
						</div>
					</div>

					<div
						className="col-xl-4 col-lg-6 col-md-6"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="200">
						<div className="single-blog-post">
							<div className="image">
								<Link href="/blogs/blog-details">
									<a className="d-block">
										<BlurImage src={blogImg3} alt="blog-image" />
									</a>
								</Link>
							</div>
							<div className="content">
								<ul className="meta">
									<li>
										<i className="bx bx-purchase-tag-alt"></i>

										<Link href="/blogs/blog-tag">
											<a>Startup</a>
										</Link>
									</li>
									<li>
										<i className="bx bx-calendar-check"></i>
										23 Nov, 2021
									</li>
								</ul>
								<h3>
									<Link href="/blogs/blog-details">
										<a>How our company works in different ways</a>
									</Link>
								</h3>
							</div>
						</div>
					</div>

					<div
						className="col-xl-4 col-lg-6 col-md-6"
						data-aos="fade-up"
						data-aos-duration="1200">
						<div className="single-blog-post">
							<div className="image">
								<Link href="/blogs/blog-details">
									<a className="d-block">
										<BlurImage src={blogImg4} alt="blog-image" />
									</a>
								</Link>
							</div>
							<div className="content">
								<ul className="meta">
									<li>
										<i className="bx bx-purchase-tag-alt"></i>

										<Link href="/blogs/blog-tag">
											<a>Technology</a>
										</Link>
									</li>
									<li>
										<i className="bx bx-calendar-check"></i>
										22 Nov, 2021
									</li>
								</ul>
								<h3>
									<Link href="/blogs/blog-details">
										<a>Giving kids and teens a safer experience online</a>
									</Link>
								</h3>
							</div>
						</div>
					</div>

					<div
						className="col-xl-4 col-lg-6 col-md-6"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="100">
						<div className="single-blog-post">
							<div className="image">
								<Link href="/blogs/blog-details">
									<a className="d-block">
										<BlurImage src={blogImg5} alt="blog-image" />
									</a>
								</Link>
							</div>
							<div className="content">
								<ul className="meta">
									<li>
										<i className="bx bx-purchase-tag-alt"></i>
										<Link href="/blogs/blog-tag">
											<a>Design</a>
										</Link>
									</li>
									<li>
										<i className="bx bx-calendar-check"></i>
										21 Nov, 2021
									</li>
								</ul>
								<h3>
									<Link href="/blogs/blog-details">
										<a>9 apps to help people sharpen their coding skills</a>
									</Link>
								</h3>
							</div>
						</div>
					</div>

					<div
						className="col-xl-4 col-lg-6 col-md-6"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="200">
						<div className="single-blog-post">
							<div className="image">
								<Link href="/blogs/blog-details">
									<a className="d-block">
										<BlurImage src={blogImg6} alt="blog-image" />
									</a>
								</Link>
							</div>
							<div className="content">
								<ul className="meta">
									<li>
										<i className="bx bx-purchase-tag-alt"></i>
										<Link href="/blogs/blog-tag">
											<a>Startup</a>
										</Link>
									</li>
									<li>
										<i className="bx bx-calendar-check"></i>
										20 Nov, 2021
									</li>
								</ul>
								<h3>
									<Link href="/blogs/blog-details">
										<a>A new model for inclusive computer science</a>
									</Link>
								</h3>
							</div>
						</div>
					</div>

					<div
						className="col-xl-4 col-lg-6 col-md-6"
						data-aos="fade-up"
						data-aos-duration="1200">
						<div className="single-blog-post">
							<div className="image">
								<Link href="/blogs/blog-details">
									<a className="d-block">
										<BlurImage src={blogImg7} alt="blog-image" />
									</a>
								</Link>
							</div>
							<div className="content">
								<ul className="meta">
									<li>
										<i className="bx bx-purchase-tag-alt"></i>
										<Link href="/blogs/blog-tag">
											<a>Technology</a>
										</Link>
									</li>
									<li>
										<i className="bx bx-calendar-check"></i>
										19 Nov, 2021
									</li>
								</ul>
								<h3>
									<Link href="/blogs/blog-details">
										<a>How sellers win when housing inventory is low</a>
									</Link>
								</h3>
							</div>
						</div>
					</div>

					<div
						className="col-xl-4 col-lg-6 col-md-6"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="100">
						<div className="single-blog-post">
							<div className="image">
								<Link href="/blogs/blog-details">
									<a className="d-block">
										<BlurImage src={blogImg8} alt="blog-image" />
									</a>
								</Link>
							</div>
							<div className="content">
								<ul className="meta">
									<li>
										<i className="bx bx-purchase-tag-alt"></i>
										<Link href="/blogs/blog-tag">
											<a>Design</a>
										</Link>
									</li>
									<li>
										<i className="bx bx-calendar-check"></i>
										18 Nov, 2021
									</li>
								</ul>
								<h3>
									<Link href="/blogs/blog-details">
										<a>Branding involves developing strategy to create point</a>
									</Link>
								</h3>
							</div>
						</div>
					</div>

					<div
						className="col-xl-4 col-lg-6 col-md-6"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="200">
						<div className="single-blog-post">
							<div className="image">
								<Link href="/blogs/blog-details">
									<a className="d-block">
										<BlurImage src={blogImg9} alt="blog-image" />
									</a>
								</Link>
							</div>
							<div className="content">
								<ul className="meta">
									<li>
										<i className="bx bx-purchase-tag-alt"></i>
										<Link href="/blogs/blog-tag">
											<a>Startup</a>
										</Link>
									</li>
									<li>
										<i className="bx bx-calendar-check"></i>
										17 Nov, 2021
									</li>
								</ul>
								<h3>
									<Link href="/blogs/blog-details">
										<a>Bootstrap 5 is open source software you can use</a>
									</Link>
								</h3>
							</div>
						</div>
					</div>

					<div
						className="col-xl-12 col-lg-12 col-md-12"
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-delay="300">
						<div className="pagination-area">
							<div className="nav-links">
								<Link href="/blogs/blog-grid">
									<a className="prev page-numbers">prev</a>
								</Link>
								<span className="page-numbers current">1</span>
								<Link href="/blogs/blog-grid">
									<a className="page-numbers">2</a>
								</Link>
								<Link href="/blogs/blog-grid">
									<a className="page-numbers">3</a>
								</Link>
								<Link href="/blogs/blog-grid">
									<a className="next page-numbers">next</a>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthorPost;
