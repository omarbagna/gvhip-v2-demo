import React from "react";
import Link from "next/link";
import Image from "next/image";

import blogImg1 from "@/public/images/blog/blog1.jpg";
import blogImg2 from "@/public/images/blog/blog2.jpg";
import blogImg3 from "@/public/images/blog/blog3.jpg";
import blogImg4 from "@/public/images/blog/blog4.jpg";

const Sidebar = () => {
  return (
    <>
      <aside className="widget-area">
        <div className="widget widget_search">
          <h3 className="widget-title">
            <span>Search</span>
          </h3>
          <form className="search-form">
            <input
              type="search"
              className="search-field"
              placeholder="Search..."
            />
            <button type="submit">
              <i className="bx bx-search"></i>
            </button>
          </form>
        </div>

        <div className="widget widget_categories">
          <h3 className="widget-title">
            <span>Categories</span>
          </h3>
          <ul>
            <li>
              <Link href="/blogs/blog-categories">
                <a>
                  Business <span className="count">(6)</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/blogs/blog-categories">
                <a>
                  Privacy <span className="count">(4)</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/blogs/blog-categories">
                <a>
                  Technology <span className="count">(5)</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/blogs/blog-categories">
                <a>
                  Tips <span className="count">(3)</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/blogs/blog-categories">
                <a>
                  Log in <span className="count">(8)</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/blogs/blog-categories">
                <a>
                  Uncategorized <span className="count">(1)</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="widget widget_posts_thumb">
          <h3 className="widget-title">
            <span>Popular Posts</span>
          </h3>
          <article className="item">
            <Link href="/blogs/blog-details">
              <a className="thumb">
                <Image src={blogImg1} alt="blog-image" />
              </a>
            </Link>
            <div className="info">
              <h4 className="title">
                <Link href="/blogs/blog-details">
                  <a>Standard operating procedures (SOP) changes with an LMS</a>
                </Link>
              </h4>
              <span className="date">19th Sep, 2021</span>
            </div>
          </article>

          <article className="item">
            <Link href="/blogs/blog-details">
              <a className="thumb">
                <Image src={blogImg2} alt="blog-image" />
              </a>
            </Link>
            <div className="info">
              <h4 className="title">
                <Link href="/blogs/blog-details">
                  <a>
                    Questions to ask vendors before choosing an LMS platform
                  </a>
                </Link>
              </h4>
              <span className="date">19th Sep, 2021</span>
            </div>
          </article>

          <article className="item">
            <Link href="/blogs/blog-details">
              <a className="thumb">
                <Image src={blogImg3} alt="blog-image" />
              </a>
            </Link>
            <div className="info">
              <h4 className="title">
                <Link href="/blogs/blog-details">
                  <a>
                    In person, virtual or hybrid: helpful tools for back to
                    school
                  </a>
                </Link>
              </h4>
              <span className="date">19th Sep, 2021</span>
            </div>
          </article>

          <article className="item">
            <Link href="/blogs/blog-details">
              <a className="thumb">
                <Image src={blogImg4} alt="blog-image" />
              </a>
            </Link>
            <div className="info">
              <h4 className="title">
                <Link href="/blogs/blog-details">
                  <a>
                    Corporate online learning trends you still need to implement
                    in 2021
                  </a>
                </Link>
              </h4>
              <span className="date">19th Sep, 2021</span>
            </div>
          </article>
        </div>

        <div className="widget widget_follow_us">
          <h3 className="widget-title">
            <span>Follow Us</span>
          </h3>
          <ul>
            <li>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.twitter.com/"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.pinterest.com/"
                target="_blank"
                rel="noreferrer"
              >
                Pinterest
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                Linkedin
              </a>
            </li>
          </ul>
        </div>

        <div className="widget widget_tag_cloud">
          <h3 className="widget-title">
            <span>Tags</span>
          </h3>
          <div className="tagcloud">
            <Link href="/blogs/blog-tag">
              <a>Advertisment</a>
            </Link>

            <Link href="/blogs/blog-tag">
              <a>Business</a>
            </Link>

            <Link href="/blogs/blog-tag">
              <a>Life</a>
            </Link>

            <Link href="/blogs/blog-tag">
              <a>Lifestyle</a>
            </Link>

            <Link href="/blogs/blog-tag">
              <a>Fashion</a>
            </Link>

            <Link href="/blogs/blog-tag">
              <a>Ads</a>
            </Link>

            <Link href="/blogs/blog-tag">
              <a>Advertisment</a>
            </Link>

            <Link href="/blogs/blog-tag">
              <a>Business</a>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
