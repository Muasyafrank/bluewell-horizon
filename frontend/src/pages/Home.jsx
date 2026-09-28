import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { catalogApi } from '../api';
import { useApiResource } from '../hooks';
import { SEO, Image } from '../components/common';
import { AsyncSection, Button, Card, SectionHeading } from '../components/ui';
import Hero from '../components/marketing/Hero';
import ValueGrid from '../components/marketing/ValueGrid';
import ServiceCard from '../components/services/ServiceCard';
import { CORE_VALUES, MISSION, VISION } from '../data/company';

export default function Home() {
  // Both requests used to fire with no error handling at all; a stopped API
  // produced an unhandled rejection and two permanently empty sections.
  const services = useApiResource((options) => catalogApi.listServices(options), { initialData: [] });
  const gallery = useApiResource((options) => catalogApi.listGallery(options), { initialData: [] });

  const featuredServices = (services.data || []).slice(0, 6);
  const featuredGallery = (gallery.data || []).slice(0, 6);

  return (
    <>
      <SEO
        title="Water treatment solutions in Kenya"
        description="Water purification, desalination and bottling plant solutions for residential, commercial and industrial clients across Kenya."
        keywords="water treatment Kenya, water purification Nairobi, reverse osmosis Kenya, water bottling plant, desalination Kenya"
      />

      <Hero />

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

          <SectionHeading
            align="center"
            title="What guides our work"
            lead="Eight commitments that shape how we specify, install and support every system."
            className="mb-5"
          />

          <ValueGrid items={CORE_VALUES} />
        </div>
      </section>

      <section className="bw-section">
        <div className="container">
          <SectionHeading
            eyebrow="Our services"
            title="Water solutions built around your supply"
            lead="From a single household filter to a full bottling line, sized on the results of your own water test."
            className="mb-5"
          />

          <AsyncSection
            loading={services.loading}
            error={services.error}
            onRetry={services.reload}
            loadingText="Loading services"
          >
            <div className="row g-4">
              {featuredServices.map((service) => (
                <div className="col-md-6 col-lg-4" key={service.id}>
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>

            {featuredServices.length > 0 ? (
              <div className="text-center mt-5">
                <Button to="/services" variant="outline" iconAfter={<FaArrowRight aria-hidden="true" />}>
                  See all services
                </Button>
              </div>
            ) : null}
          </AsyncSection>
        </div>
      </section>

      <section className="bw-section bw-section--tint">
        <div className="container">
          <SectionHeading
            eyebrow="Our work"
            title="Projects and installations"
            lead="A sample of systems we have designed, installed and now maintain."
            className="mb-5"
          />

          <AsyncSection
            loading={gallery.loading}
            error={gallery.error}
            onRetry={gallery.reload}
            loadingText="Loading projects"
          >
            <div className="row g-4">
              {featuredGallery.map((item) => (
                <div className="col-md-6 col-lg-4" key={item.id}>
                  <Card flush>
                    <Image src={item.image} alt={item.title} className="bw-card__media" />
                    <div className="bw-card__body">
                      <p className="small text-muted mb-1">{item.category}</p>
                      <h3 className="bw-card__title mb-0">{item.title}</h3>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </AsyncSection>
        </div>
      </section>

      <section className="bw-band bw-section" style={{ backgroundImage: "url('/images/gallery-2.png')" }}>
        <div className="container text-center">
          <h2 className="display-6 fw-bold mb-3">Not sure what your water needs?</h2>
          <p className="bw-lead mx-auto mb-5">
            Book a free water test and system design consultation. We will tell you what is in your
            supply and what it would take to fix it.
          </p>
          <Button to="/contact" variant="onDark" size="lg">
            Book a free consultation
          </Button>
        </div>
      </section>
    </>
  );
}
