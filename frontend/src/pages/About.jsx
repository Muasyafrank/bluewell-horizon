import React from 'react';
import { FaAward, FaShieldAlt, FaTools, FaUsers } from 'react-icons/fa';
import { SEO } from '../components/common';
import { PageBanner } from '../components/layout';
import { Button, Card, SectionHeading } from '../components/ui';
import ValueGrid from '../components/marketing/ValueGrid';
import { CORE_VALUES, MISSION, VISION } from '../data/company';

const CAPABILITIES = [
  { icon: <FaAward size={20} />, title: 'Certified equipment', description: 'Industry-grade systems and components with documented specifications.' },
  { icon: <FaUsers size={20} />, title: 'Every sector', description: 'Homes, businesses, schools, hospitals and industrial plants.' },
  { icon: <FaTools size={20} />, title: 'Installed and supported', description: 'Commissioning, servicing and spare parts handled by our own engineers.' },
  { icon: <FaShieldAlt size={20} />, title: 'Tested output', description: 'Treated water verified against Kenyan and WHO drinking water standards.' },
];

export default function About() {
  return (
    <>
      <SEO
        title="About us"
        description="Bluewell Horizon Limited is a Kenyan water treatment company designing, supplying, installing and maintaining water systems for every sector."
        path="/about"
      />

      <PageBanner
        eyebrow="Who we are"
        title="Water treatment you can rely on"
        lead="A Kenyan engineering company specialising in the design, supply, installation and maintenance of water treatment systems."
      />

      <section className="bw-section">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-7">
              <h2 className="h3 mb-4">Built around your water, not a catalogue</h2>
              <p className="bw-prose mb-4">
                Bluewell Horizon Limited supplies and maintains water treatment technology for
                residential, commercial, institutional and industrial clients. Every project starts
                with a test of your actual supply, because the right system depends on what is in
                the water rather than on what we happen to stock.
              </p>
              <p className="bw-prose mb-0">
                We handle the whole chain: diagnosis, system design, supply, installation,
                commissioning and the servicing that keeps output within spec for years afterwards.
              </p>
            </div>

            <div className="col-lg-5">
              <div className="row g-3">
                {CAPABILITIES.map((item) => (
                  <div className="col-sm-6 col-lg-12" key={item.title}>
                    <Card>
                      <div className="d-flex gap-3">
                        <span className="bw-feature-icon bw-feature-icon--soft mb-0" aria-hidden="true">
                          {item.icon}
                        </span>
                        <div>
                          <h3 className="bw-card__title">{item.title}</h3>
                          <p className="bw-card__text">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bw-section bw-section--tint">
        <div className="container">
          <div className="row g-4 g-lg-5 mb-5">
            <div className="col-lg-6">
              <Card className="h-100">
                <h2 className="h4 mb-3">{MISSION.title}</h2>
                <p className="bw-lead mb-4">{MISSION.lead}</p>
                <p className="bw-prose mb-0">{MISSION.body}</p>
              </Card>
            </div>
            <div className="col-lg-6">
              <Card className="h-100">
                <h2 className="h4 mb-3">{VISION.title}</h2>
                <p className="bw-lead mb-4">{VISION.lead}</p>
                <p className="bw-prose mb-0">{VISION.body}</p>
              </Card>
            </div>
          </div>

          <SectionHeading align="center" title="What guides our work" className="mb-5" />
          <ValueGrid items={CORE_VALUES} />
        </div>
      </section>

      <section className="bw-section bw-section--navy">
        <div className="container text-center">
          <h2 className="h3 mb-3">Let’s look at your water</h2>
          <p className="bw-lead mx-auto mb-5">
            Tell us where you are and what the water is doing, and we will arrange a test.
          </p>
          <Button to="/contact" variant="onDark" size="lg">
            Book a free consultation
          </Button>
        </div>
      </section>
    </>
  );
}
