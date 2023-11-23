import React from "react";
import Image from "next/image";
import Link from "next/link";

import BlogImage1 from "@/public/images/blog/blog1.jpg";
import BlogImage2 from "@/public/images/blog/blog2.jpg";
import BlogImage3 from "@/public/images/blog/blog3.jpg";

const BlogPostStyle1 = () => {
  return (
    <div className="blog-area with-top-border pb-75 pt-100">
      <div className="container">
        <div className="section-title">
          <span className="sub-title">Latest News</span>
          <h2>Our latest articles & resources</h2>
        </div>

        <div className="row justify-content-center">
          <div
            className="col-xl-4 col-lg-6 col-md-6"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            <div className="single-blog-post">
              <div className="image">
                <Link href="/blogs/blog-details">
                  <a className="d-block">
                    <Image src={BlogImage1} alt="blog-image" />
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
            data-aos-delay="100"
          >
            <div className="single-blog-post">
              <div className="image">
                <Link href="/blogs/blog-details">
                  <a className="d-block">
                    <Image src={BlogImage2} alt="blog-image" />
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
            data-aos-delay="200"
          >
            <div className="single-blog-post">
              <div className="image">
                <Link href="/blogs/blog-details">
                  <a className="d-block">
                    <Image src={BlogImage3} alt="blog-image" />
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
        </div>
      </div>
    </div>
  );
};

export default BlogPostStyle1;
