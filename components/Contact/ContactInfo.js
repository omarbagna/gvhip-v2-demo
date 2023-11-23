import React from "react";

const ContactInfo = () => {
  return (
    <>
      <div className="contact-info-area bg-f1f5fd">
        <div className="container">
          <div className="contact-info-inner">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="single-contact-info-box">
                  <div className="icon bg1">
                    <i className="bx bx-phone-call"></i>
                  </div>
                  <h3>
                    <a href="tel:+321895980008">(+321) 895-980 008</a>
                  </h3>
                  <h3>
                    <a href="tel:+321895980008">(+321) 895-980 008</a>
                  </h3>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="single-contact-info-box">
                  <div className="icon">
                    <i className="bx bx-envelope"></i>
                  </div>
                  <h3>
                    <a href="mailto:hello@abev.com">hello@abev.com</a>
                  </h3>
                  <h3>
                    <a href="mailto:info@abev.com">info@abev.com</a>
                  </h3>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="single-contact-info-box">
                  <div className="icon bg2">
                    <i className="bx bx-map"></i>
                  </div>
                  <h3>2750 Quadra Street Victoria, Canada.</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactInfo;
