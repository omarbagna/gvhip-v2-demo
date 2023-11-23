import React from "react";
import Image from "next/image";

import subscribeImg from "@/public/images/subscribe1.png";

const SubscribeStyle1 = () => {
  return (
    <div className="subscribe-area bg-f9f9f9 ptb-100">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12">
            <div
              className="subscribe-content"
              data-aos="fade-down"
              data-aos-duration="1200"
            >
              <span className="sub-title">Subscribe Our Newsletter</span>
              <h2>The latest resources, sent to your inbox weekly</h2>
              <form className="newsletter-form">
                <div className="row">
                  <div className="col-xl-8 col-lg-7 col-md-8">
                    <input
                      type="text"
                      className="input-newsletter"
                      placeholder="Enter your email address"
                      name="EMAIL"
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-xl-4 col-lg-5 col-md-4">
                    <button
                      type="submit"
                      className="btn-style-one red-light-color"
                    >
                      Subscribe Now <i className="bx bx-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div
              className="subscribe-image"
              data-aos="fade-up"
              data-aos-duration="1200"
            >
              <Image src={subscribeImg} alt="subscribe-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribeStyle1;
