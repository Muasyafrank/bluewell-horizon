import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { catalogApi } from '../api';
import { useApiResource, useGalleryItems } from '../hooks';
import { Reveal, SEO } from '../components/common';
import { AsyncSection, Button, SectionHeading } from '../components/ui';
import CtaBand from '../components/marketing/CtaBand';
import MissionVision from '../components/marketing/MissionVision';
import PageHero from '../components/marketing/PageHero';
import ProjectTile from '../components/marketing/ProjectTile';
import StatStrip from '../components/marketing/StatStrip';
import ValuesSection from '../components/marketing/ValuesSection';
import ServiceCard from '../components/services/ServiceCard';
import { COMPANY_STATS } from '../data/company';

/** The sectors named in the About copy ("homes, businesses, schools, hospitals and industrial plants"). */
const SECTORS = ['Homes', 'Businesses', 'Schools', 'Hospitals', 'Industry'];

export default function Home() {
  const services = useApiResource((options) => catalogApi.listServices(options), { initialData: [] });
  const gallery = useGalleryItems();

  const featuredServices = (services.data || []).slice(0, 6);
  const featuredGallery = gallery.items.slice(0, 6);

  return (
    <>
      <SEO
        title="Water treatment solutions in Kenya"
        description="Water purification, desalination and bottling plant solutions for residential, commercial and industrial clients across Kenya."
        keywords="water treatment Kenya, water purification Nairobi, reverse osmosis Kenya, water bottling plant, desalination Kenya"
      />

      <PageHero
        size="lg"
        eyebrow="Bluewell Horizon Solutions Limited"
        title={<>Pure water, engineered with <em>precision</em></>}
        lead="We design, supply, install and maintain water treatment systems for homes, businesses, institutions and industry across Kenya."
        image="/images/gallery-3.png"
        actions={
          <>
            <Button to="/contact" variant="onDark" size="lg">Book a free consultation</Button>
            <Button to="/services" variant="ghostOnDark" size="lg" iconAfter={<FaArrowRight aria-hidden="true" />}>
              See what we do
            </Button>
          </>
        }
        overlap={<StatStrip stats={COMPANY_STATS} />}
      >
        <ul className="bw-chips" aria-label="Sectors we serve">
          {SECTORS.map((sector) => (
            <li key={sector}>{sector}</li>
          ))}
        </ul>
      </PageHero>

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
              {featuredServices.map((service, index) => (
                <Reveal className="col-md-6 col-lg-4" index={index % 3} key={service.id}>
                  <ServiceCard service={service} />
                </Reveal>
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

          <AsyncSection loading={gallery.loading} error={null} onRetry={gallery.reload} loadingText="Loading projects">
            <div className="row g-4">
              {featuredGallery.map((item, index) => (
                <Reveal className="col-md-6 col-lg-4" index={index % 3} key={item.id}>
                  <ProjectTile item={item} />
                </Reveal>
              ))}
            </div>

            {featuredGallery.length > 0 ? (
              <div className="text-center mt-5">
                <Button to="/gallery" variant="outline" iconAfter={<FaArrowRight aria-hidden="true" />}>
                  View the full gallery
                </Button>
              </div>
            ) : null}
          </AsyncSection>
        </div>
      </section>

      <MissionVision />
      <ValuesSection lead="Eight commitments that shape how we specify, install and support every system." />

      <CtaBand
        title="Not sure what your water needs?"
        lead="Book a free water test and system design consultation. We will tell you what is in your supply and what it would take to fix it."
        primary={{ to: '/contact', label: 'Book a free consultation' }}
        secondary={{ to: '/quote', label: 'Request a quote' }}
      />
    </>
  );
}
