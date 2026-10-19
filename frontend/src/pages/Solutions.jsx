import React, { useState } from 'react';
import { FaTint } from 'react-icons/fa';
import { catalogApi } from '../api';
import { useApiResource } from '../hooks';
import { Reveal, SEO } from '../components/common';
import { AsyncSection, Button, EmptyState, SectionHeading } from '../components/ui';
import CtaBand from '../components/marketing/CtaBand';
import PageHero from '../components/marketing/PageHero';
import { ProcessList } from '../components/marketing/ProcessTimeline';
import ServiceCard from '../components/services/ServiceCard';
import ServiceModal from '../components/services/ServiceModal';
import TechnologyCard from '../components/services/TechnologyCard';

export default function Solutions() {
  const [selectedService, setSelectedService] = useState(null);

  const services = useApiResource((options) => catalogApi.listServices(options), { initialData: [] });
  const technologies = useApiResource((options) => catalogApi.listTechnologies(options), { initialData: [] });
  const processSteps = useApiResource((options) => catalogApi.listProcessSteps(options), { initialData: [] });

  return (
    <>
      <SEO
        title="Services and technologies"
        description="Water purification, bottling plants, desalination and disinfection, delivered with RO, UV, EDI and other treatment technologies."
        keywords="water purification services, RO systems Kenya, UV sterilisation, water bottling solutions, desalination systems, EDI water treatment"
        path="/services"
      />

      <PageHero
        eyebrow="Services and technologies"
        title={<>Treatment systems, engineered <em>end to end</em></>}
        lead="We pair proven treatment technology with our own engineering so each system matches the water it has to handle."
        image="/images/gallery-10.png"
        actions={
          <>
            <Button to="/contact" variant="onDark" size="lg">Book a free consultation</Button>
            <Button to="/quote" variant="ghostOnDark" size="lg">Request a quote</Button>
          </>
        }
      />

      <section className="bw-section">
        <div className="container">
          <SectionHeading
            eyebrow="What we do"
            title="Core services"
            lead="Select any service to see what it covers, where it fits and what you get."
            className="mb-5"
          />

          <AsyncSection
            loading={services.loading}
            error={services.error}
            onRetry={services.reload}
            loadingText="Loading services"
            isEmpty={!services.data?.length}
            empty={
              <EmptyState
                icon={<FaTint />}
                title="No services listed yet"
                description="Services appear here once they are added in the admin dashboard."
                action={<Button to="/contact">Ask us what we offer</Button>}
              />
            }
          >
            <div className="row g-4">
              {(services.data || []).map((service, index) => (
                <Reveal className="col-md-6 col-lg-4" index={index % 3} key={service.id}>
                  <ServiceCard service={service} onSelect={setSelectedService} />
                </Reveal>
              ))}
            </div>
          </AsyncSection>
        </div>
      </section>

      <section className="bw-section bw-section--tint">
        <div className="container">
          <SectionHeading
            eyebrow="Technology"
            title="The technologies behind them"
            lead="Each system combines several of these, chosen against your water test results."
            className="mb-5"
          />

          <AsyncSection
            loading={technologies.loading}
            error={technologies.error}
            onRetry={technologies.reload}
            loadingText="Loading technologies"
          >
            <div className="row g-4">
              {(technologies.data || []).map((technology, index) => (
                <Reveal className="col-md-6 col-lg-4" index={index % 3} key={technology.id}>
                  <TechnologyCard technology={technology} />
                </Reveal>
              ))}
            </div>
          </AsyncSection>
        </div>
      </section>

      <section className="bw-section">
        <div className="container">
          <SectionHeading align="center" eyebrow="Process" title="How a project runs" className="mb-5" />

          <AsyncSection
            loading={processSteps.loading}
            error={processSteps.error}
            onRetry={processSteps.reload}
            loadingText="Loading process"
            isEmpty={!processSteps.data?.length}
            empty={<p className="text-center text-muted mb-0">Our project process will appear here soon.</p>}
          >
            <ProcessList steps={processSteps.data || []} />
          </AsyncSection>
        </div>
      </section>

      <CtaBand
        title="Not sure which system fits your water?"
        lead="Tell us what the water is doing and we will arrange a free test, then recommend what it would take to fix it."
        primary={{ to: '/contact', label: 'Book a free consultation' }}
        secondary={{ to: '/quote', label: 'Request a quote' }}
      />

      <ServiceModal
        service={selectedService}
        open={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
      />
    </>
  );
}
