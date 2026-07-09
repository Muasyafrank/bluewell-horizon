import SEO from '../components/SEO';
import React from 'react';
import AboutSection from '../components/About';
import PageHeader from '../components/layout/PageHeader';

const About = () => (
  <>
    <SEO 
      title="About Us - Trusted Water Treatment Experts"
      description="Learn about Bluewell Horizon Limited - Your trusted partner in water treatment. Discover our mission, vision, core values, and commitment to excellence in delivering safe, clean water solutions."
      keywords="about Bluewell Horizon, water treatment company Kenya, water purification experts Nairobi"
      url="https://www.bluewellhorizonlimited.com/about"
    />  
    <PageHeader title="About Us" subtitle="Trusted provider of innovative water treatment technologies" />
    <AboutSection />
  </>
);
export default About;