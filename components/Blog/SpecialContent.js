import React from "react";
import Image from "next/image";
import Link from "next/link";

import blogImg1 from "@/public/images/blog/blog1.jpg";
import blogImg2 from "@/public/images/blog/blog2.jpg";
import blogImg3 from "@/public/images/blog/blog3.jpg";
import blogImg4 from "@/public/images/blog/blog7.jpg";
import blogImg5 from "@/public/images/blog/blog8.jpg";
import blogImg6 from "@/public/images/blog/blog9.jpg";
import blogImg7 from "@/public/images/blog/blog5.jpg";
import blogImg8 from "@/public/images/blog/blog13.jpg";
import blogImg9 from "@/public/images/blog/blog14.jpg";

const SpecialContent = () => {
  return (
    <>
      <div className="blog-area pt-100 pb-75">
        <div className="container">
          <div className="section-title">
            <h2>IT Startup Articles</h2>
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
                      <Image src={blogImg1} alt="blog-image" />
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
                      <Image src={blogImg2} alt="blog-image" />
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
                      <Image src={blogImg3} alt="blog-image" />
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

      <div className="blog-area pt-100 pb-75 bg-f9f9f9">
        <div className="container">
          <div className="section-title">
            <h2>Insurance Articles</h2>
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
                      <Image src={blogImg4} alt="blog-image" />
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
              data-aos-delay="100"
            >
              <div className="single-blog-post">
                <div className="image">
                  <Link href="/blogs/blog-details">
                    <a className="d-block">
                      <Image src={blogImg5} alt="blog-image" />
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
              data-aos-delay="200"
            >
              <div className="single-blog-post">
                <div className="image">
                  <Link href="/blogs/blog-details">
                    <a className="d-block">
                      <Image src={blogImg6} alt="blog-image" />
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
          </div>
        </div>
      </div>

      <div className="blog-area pt-100 pb-75">
        <div className="container">
          <div className="section-title">
            <h2>Software Articles</h2>
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
                      <Image src={blogImg7} alt="blog-image" />
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
              data-aos-delay="100"
            >
              <div className="single-blog-post">
                <div className="image">
                  <Link href="/blogs/blog-details">
                    <a className="d-block">
                      <Image src={blogImg8} alt="blog-image" />
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
                      <a>
                        Branding involves developing strategy to create point
                      </a>
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
                      <Image src={blogImg9} alt="blog-image" />
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
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialContent;
