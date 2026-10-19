import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { SEO } from '../components/common';
import CtaBand from '../components/marketing/CtaBand';
import MissionVision from '../components/marketing/MissionVision';
import PageHero from '../components/marketing/PageHero';
import ProcessTimeline from '../components/marketing/ProcessTimeline';
import StatStrip from '../components/marketing/StatStrip';
import ValuesSection from '../components/marketing/ValuesSection';
import { Button } from '../components/ui';
import { COMPANY_STATS } from '../data/company';
import StorySection from './about/StorySection';
import { CHAIN_STEPS } from './about/content';

export default function About() {
  return (
    <>
      <SEO
        title="About us"
        description="Bluewell Horizon Limited is a Kenyan water treatment company designing, supplying, installing and maintaining water systems for every sector."
        path="/about"
      />
      <PageHero
        eyebrow="Who we are"
        title={<>Water treatment you can <em>rely on</em></>}
        lead="A Kenyan engineering company specialising in the design, supply, installation and maintenance of water treatment systems."
        image="/images/gallery-3.png"
        actions={
          <>
            <Button to="/contact" variant="onDark" size="lg">Book a consultation</Button>
            <Button to="/services" variant="ghostOnDark" size="lg" iconAfter={<FaArrowRight aria-hidden="true" />}>
              Explore our solutions
            </Button>
          </>
        }
        overlap={<StatStrip stats={COMPANY_STATS} />}
      />
      <StorySection />
      <ProcessTimeline
        steps={CHAIN_STEPS}
        eyebrow="How we work"
        title="From first test to long-term support"
        lead="We handle the whole chain, so one team stays accountable from the first sample to the last service visit."
      />
      <MissionVision />
      <ValuesSection />
      <CtaBand
        title="Let’s look at your water"
        lead="Tell us where you are and what the water is doing, and we will arrange a test."
        primary={{ to: '/contact', label: 'Book a free consultation' }}
        secondary={{ to: '/quote', label: 'Request a quote' }}
      />
    </>
  );
}
