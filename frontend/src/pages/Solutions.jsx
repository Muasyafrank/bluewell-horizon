import React, { useState } from 'react';
import { catalogApi } from '../api';
import { useApiResource } from '../hooks';
import { SEO } from '../components/common';
import { PageBanner } from '../components/layout';
import { AsyncSection, Button, EmptyState, SectionHeading } from '../components/ui';
import ServiceCard from '../components/services/ServiceCard';
import ServiceModal from '../components/services/ServiceModal';
import TechnologyCard from '../components/services/TechnologyCard';
import ProcessSteps from '../components/services/ProcessSteps';
import { FaTint } from 'react-icons/fa';

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

      <PageBanner
        eyebrow="Services and technologies"
        title="Treatment systems, engineered end to end"
        lead="We pair proven treatment technology with our own engineering so each system matches the water it has to handle."
      />

      <section className="bw-section">
        <div className="container">
          <SectionHeading
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
              {(services.data || []).map((service) => (
                <div className="col-md-6 col-lg-4" key={service.id}>
                  <ServiceCard service={service} onSelect={setSelectedService} />
                </div>
              ))}
            </div>
          </AsyncSection>
        </div>
      </section>

      <section className="bw-section bw-section--tint">
        <div className="container">
          <SectionHeading
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
              {(technologies.data || []).map((technology) => (
                <div className="col-md-6 col-lg-4" key={technology.id}>
                  <TechnologyCard technology={technology} />
                </div>
              ))}
            </div>
          </AsyncSection>
        </div>
      </section>

      <section className="bw-section">
        <div className="container">
          <SectionHeading align="center" title="How a project runs" className="mb-5" />

          <AsyncSection
            loading={processSteps.loading}
            error={processSteps.error}
            onRetry={processSteps.reload}
            loadingText="Loading process"
          >
            <ProcessSteps steps={processSteps.data || []} />
          </AsyncSection>

          <div className="text-center mt-5">
            <Button to="/contact" size="lg">
              Book a free consultation
            </Button>
          </div>
        </div>
      </section>

      <ServiceModal
        service={selectedService}
        open={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
      />
    </>
  );
}
