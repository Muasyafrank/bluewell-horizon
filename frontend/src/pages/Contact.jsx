import React from 'react';
import { SEO } from '../components/common';
import PageHero from '../components/marketing/PageHero';
import { ProcessList } from '../components/marketing/ProcessTimeline';
import { SectionHeading } from '../components/ui';
import ContactCards from './contact/ContactCards';
import ContactForm from './contact/ContactForm';
import OfficeMap from './contact/OfficeMap';

/** What happens after the form is sent, taken from the page's own promises. */
const NEXT_STEPS = [
  { title: 'We reply', description: 'Every enquiry gets an answer within one working day.' },
  { title: 'We test your water', description: 'We arrange a free test and consultation.' },
  { title: 'You get a plan', description: 'We tell you what is in your supply and what it would take to fix it.' },
];

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact us"
        description="Contact Bluewell Horizon Limited for a free water consultation in Nairobi. Call 0721 633 223 or email bluewellsynergy@gmail.com."
        path="/contact"
      />

      <PageHero
        eyebrow="Contact"
        title={<>Let’s talk about your <em>water</em></>}
        lead="Tell us what your supply is doing and we will arrange a free test and consultation."
        overlap={<ContactCards />}
      />

      <section className="bw-section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7">
              <div className="bw-form-card">
                <SectionHeading
                  eyebrow="Send a message"
                  title="Book a free consultation"
                  lead="We reply to every enquiry within one working day."
                  className="mb-4"
                />
                <ContactForm />
              </div>
            </div>

            <div className="col-lg-5">
              <SectionHeading
                eyebrow="Find us"
                title="Visit the office"
                lead="We are in Harambee Estate, Nairobi. Drop in to talk through a system in person."
                className="mb-4"
              />
              <OfficeMap />

              <div className="bw-next-steps">
                <h3>What happens next</h3>
                <ProcessList steps={NEXT_STEPS} stacked />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
