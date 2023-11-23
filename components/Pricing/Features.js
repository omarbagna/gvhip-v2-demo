import React from "react";

const Features = () => {
  return (
    <div className="features-area pb-75">
      <div className="container">
        <div className="row justify-content-center">
          <div
            className="col-lg-4 col-md-6 col-sm-6"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            <div className="single-features-item">
              <div className="icon">
                <i className="bx bx-info-circle"></i>
              </div>
              <h3 className="nunito-font">24/7 Support</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed est
                non feugiat sagittis, donec.
              </p>
            </div>
          </div>
          <div
            className="col-lg-4 col-md-6 col-sm-6"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-delay="100"
          >
            <div className="single-features-item">
              <div className="icon">
                <i className="bx bx-repeat"></i>
              </div>
              <h3 className="nunito-font">Daily Updates</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed est
                non feugiat feu sagittis, donec.
              </p>
            </div>
          </div>
          <div
            className="col-lg-4 col-md-6 col-sm-6"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-delay="200"
          >
            <div className="single-features-item">
              <div className="icon">
                <i className="bx bxs-fast-forward-circle"></i>
              </div>
              <h3 className="nunito-font">Faster Benefits</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed est
                non feugiat feu sagittis, donec.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
