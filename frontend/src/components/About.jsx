import React from 'react';

const About = () => (
  <section id="about" className="section-dark section-dark-alt">
    <div className="container">
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="section-label">About Us</div>
          <h2 className="section-title">
            Trusted provider of innovative<br />water treatment technologies
          </h2>
          <p className="section-subtitle">
            We specialize in designing, supplying, installing, and maintaining high-quality water systems for residential, commercial, institutional, and industrial clients.
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="mv-card-dark">
            <h3>Our Mission</h3>
            <p>
              To design, supply, and maintain reliable, innovative water treatment systems for residential, commercial, and industrial clients — ensuring access to safe, clean water at every level. We are committed to delivering affordable, high-quality solutions tailored to the unique needs of each client, powered by modern technology and professional expertise.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mv-card-dark">
            <h3>Our Vision</h3>
            <p>
              To become the leading and most trusted provider of water treatment solutions in the region, recognized as a reliable partner in delivering advanced, sustainable, and innovative water systems. We envision a future where every community has access to safe and clean water, driven by our commitment to excellence, integrity, and environmental responsibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;