import React from 'react';
import Button from '../ui/Button';
import { COMPANY_STATS } from '../../data/company';

/**
 * Home page hero.
 *
 * The old markup put light-grey body text (#030e14 on a pale scrim) over a
 * photograph, which was close to unreadable. The scrim and type colours now
 * come from `.bw-hero`, so contrast holds whatever the background image is.
 */
export default function Hero() {
  return (
    <section className="bw-hero" style={{ backgroundImage: "url('/images/gallery-3.png')" }}>
      <div className="container bw-hero__inner">
        <div className="row justify-content-center text-center">
          <div className="col-lg-10">
            <p className="bw-wordmark mb-1">
              Bluewell <span>Horizon</span>
            </p>
            <p className="bw-wordmark__sub">Limited</p>

            <h1 className="bw-hero__title">
              Pure water, engineered with <em>precision</em>
            </h1>

            <p className="bw-lead mx-auto mb-5">
              We design, supply, install and maintain water treatment systems for homes,
              businesses, institutions and industry across Kenya.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3 mb-6">
              <Button to="/contact" variant="onDark" size="lg">
                Book a free consultation
              </Button>
              <Button to="/services" variant="ghostOnDark" size="lg">
                See what we do
              </Button>
            </div>

            <div className="row g-3 mt-5">
              {COMPANY_STATS.map((stat) => (
                <div className="col-md-4" key={stat.label}>
                  <div className="bw-stat">
                    <p className="bw-stat__value">{stat.value}</p>
                    <p className="bw-stat__label">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
