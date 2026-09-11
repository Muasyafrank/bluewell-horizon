import React from 'react';
import { 
  FaAward, FaUsers, FaTools, FaShieldAlt, FaBullseye, FaEye, 
  FaHandshake, FaLeaf, FaClock, FaLightbulb, FaChartLine,
  FaCogs, FaIndustry, FaHome, FaBuilding
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AboutSection = () => (
  <>
    {/* About Us Intro Section */}
    <section className="py-5" style={{ 
      backgroundImage: `linear-gradient(rgba(13, 13, 13, 0.95), rgba(32, 34, 36, 0.95)), url('/images/gallery-3.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container py-5">
        {/* Section Label */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div style={{ width: '40px', height: '1px', backgroundColor: '#2fa5b6' }}></div>
          <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>
            Who We Are
          </span>
        </div>

        {/* Headline */}
        <h2 className="display-4 fw-bold mb-4" style={{ color: '#0b2540', lineHeight: 1.2, maxWidth: '800px' }}>
          Innovative water solutions you can <span className="fst-italic" style={{ color: '#2fa5b6' }}>rely on.</span>
        </h2>

        {/* Body Text */}
        <p className="lead mb-4" style={{ color: '#4a5568', lineHeight: 1.7 }}>
          Bluewell Horizon Limited is a trusted provider of innovative and reliable water treatment technologies. We specialize in designing, supplying, installing, and maintaining high-quality water systems for residential, commercial, institutional, and industrial clients.
        </p>
        <p className="mb-5" style={{ color: '#4a5568', lineHeight: 1.7, maxWidth: '800px' }}>
          With a commitment to excellence, sustainability, and customer satisfaction, we deliver customized water solutions that meet the highest standards of safety, efficiency, and environmental responsibility.
        </p>

        {/* Feature Cards Grid */}
        <div className="row g-4">
          {[
            { icon: <FaAward size={20} />, title: "Certified Quality", desc: "Industry-grade systems and components." },
            { icon: <FaUsers size={20} />, title: "Every Sector", desc: "Homes, businesses, schools, industries." },
            { icon: <FaTools size={20} />, title: "Expert Installation", desc: "Professional setup and ongoing technical support." },
            { icon: <FaShieldAlt size={20} />, title: "Safe & Reliable", desc: "Advanced purification meeting highest safety standards." }
          ].map((item, index) => (
            <div className="col-md-6" key={index}>
              <div 
                className="p-4 rounded-4 h-100 d-flex flex-column" 
                style={{ 
                  border: '1px solid #e2e8f0', 
                  backgroundColor: '#ffffff', 
                  transition: 'all 0.3s ease' 
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.borderColor = '#2fa5b6'; 
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(47, 165, 182, 0.12)'; 
                  e.currentTarget.style.transform = 'translateY(-4px)'; 
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.borderColor = '#e2e8f0'; 
                  e.currentTarget.style.boxShadow = 'none'; 
                  e.currentTarget.style.transform = 'translateY(0)'; 
                }}
              >
                <div className="d-flex align-items-center justify-content-center rounded-circle mb-3" 
                     style={{ width: '48px', height: '48px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                  {item.icon}
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#0b2540', fontSize: '1.1rem' }}>{item.title}</h5>
                <p className="mb-0 small" style={{ color: '#718096', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Mission & Vision Section */}
    <section className="py-5" style={{ 
      backgroundImage: `linear-gradient(rgba(6, 17, 28, 0.85), rgba(6, 17, 28, 0.95)), url('/images/gallery-3.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#2fa5b6' }}></div>
            <span className="text-uppercase small fw-semibold" style={{ color: '#2fa5b6', letterSpacing: '3px' }}>Our Purpose</span>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#2fa5b6' }}></div>
          </div>
          <h2 className="display-5 fw-bold mb-3" style={{ color: '#ffffff', lineHeight: 1.2 }}>
            Mission & <span className="fst-italic" style={{ color: '#7dd3e3' }}>Vision</span>
          </h2>
          <p className="lead mx-auto" style={{ color: '#cbd5e0', maxWidth: '700px', fontWeight: '300' }}>
            The foundation that drives everything we do at Bluewell Horizon Limited.
          </p>
        </div>

        <div className="row g-5">
          {/* Mission */}
          <div className="col-lg-6">
            <div className="p-5 rounded-4 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '1.5rem' }}>
                  <FaBullseye />
                </div>
                <div>
                  <span className="text-uppercase small fw-semibold d-block" style={{ color: '#2fa5b6', letterSpacing: '3px', fontSize: '0.75rem' }}>Our Mission</span>
                  <h3 className="fw-bold mb-0" style={{ color: '#ffffff' }}>What We Do</h3>
                </div>
              </div>
              <p className="lead mb-4" style={{ color: '#7dd3e3', lineHeight: 1.8, fontWeight: '300' }}>
                To design, supply, and maintain reliable, innovative water treatment systems for residential, commercial, and industrial clients — ensuring access to safe, clean water at every level.
              </p>
              <p className="mb-0" style={{ color: '#cbd5e0', lineHeight: 1.7 }}>
                We are committed to delivering affordable, high-quality solutions tailored to the unique needs of each client, powered by modern technology and professional expertise. Upholding integrity, transparency, and timely service, we strive for continuous improvement and sustainable water use, building long-term partnerships grounded in trust and excellence.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="col-lg-6">
            <div className="p-5 rounded-4 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '1.5rem' }}>
                  <FaEye />
                </div>
                <div>
                  <span className="text-uppercase small fw-semibold d-block" style={{ color: '#2fa5b6', letterSpacing: '3px', fontSize: '0.75rem' }}>Our Vision</span>
                  <h3 className="fw-bold mb-0" style={{ color: '#ffffff' }}>Where We're Going</h3>
                </div>
              </div>
              <p className="lead mb-4" style={{ color: '#7dd3e3', lineHeight: 1.8, fontWeight: '300' }}>
                To become the leading and most trusted provider of water treatment solutions in the region, recognized as a reliable partner in delivering advanced, sustainable, and innovative water systems.
              </p>
              <p className="mb-0" style={{ color: '#cbd5e0', lineHeight: 1.7 }}>
                We envision a future where every community has access to safe and clean water, driven by our commitment to excellence, integrity, and environmental responsibility. Through the adoption of emerging technologies and continuous improvement in service delivery, we aspire to set industry standards while positively impacting lives and contributing to a healthier, more sustainable world for generations to come.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Core Values Section */}
    <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
            <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>What Guides Us</span>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
          </div>
          <h2 className="display-5 fw-bold mb-3" style={{ color: '#0b2540', lineHeight: 1.2 }}>
            Our Core <span className="fst-italic" style={{ color: '#2fa5b6' }}>Values</span>
          </h2>
          <p className="lead mx-auto" style={{ color: '#4a5568', maxWidth: '700px', fontWeight: '300' }}>
            These principles define who we are and how we serve our clients every day.
          </p>
        </div>

        <div className="row g-4">
          {[
            { icon: FaAward, title: 'Excellence', desc: 'Delivering the highest quality water treatment solutions that exceed expectations in every project we undertake.' },
            { icon: FaShieldAlt, title: 'Integrity', desc: 'Upholding honesty, transparency, and ethical practices in all our operations and client relationships.' },
            { icon: FaHandshake, title: 'Trust', desc: 'Building long-term partnerships grounded in reliability, consistency, and mutual respect with every client.' },
            { icon: FaLeaf, title: 'Sustainability', desc: 'Promoting environmental responsibility and sustainable water use to protect resources for future generations.' },
            { icon: FaClock, title: 'Timely Service', desc: 'Committed to fast response times and on-time project delivery to keep your operations running smoothly.' },
            { icon: FaLightbulb, title: 'Innovation', desc: 'Adopting emerging technologies and continuous improvement in service delivery to stay ahead of the curve.' },
            { icon: FaUsers, title: 'Customer Satisfaction', desc: 'Tailoring solutions to meet the unique needs of each client, ensuring complete satisfaction and success.' },
            { icon: FaChartLine, title: 'Continuous Improvement', desc: 'Striving for excellence through ongoing learning, development, and refinement of our processes.' }
          ].map((value, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="p-4 rounded-4 h-100 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', transition: 'all 0.3s ease' }}
                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2fa5b6'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(47, 165, 182, 0.12)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div className="d-flex align-items-center justify-content-center rounded-circle mb-3 mx-auto" style={{ width: '70px', height: '70px', backgroundColor: '#f0f9fa', color: '#2fa5b6', fontSize: '1.8rem' }}>
                  <value.icon />
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#0b2540', fontSize: '1.1rem' }}>{value.title}</h5>
                <p className="mb-0 small" style={{ color: '#718096', lineHeight: 1.6 }}>{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* What We Specialize In */}
    <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
            <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>Our Expertise</span>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
          </div>
          <h2 className="display-5 fw-bold mb-3" style={{ color: '#0b2540', lineHeight: 1.2 }}>
            What We <span className="fst-italic" style={{ color: '#2fa5b6' }}>Specialize In</span>
          </h2>
        </div>

        <div className="row g-4">
          {[
            { icon: FaCogs, title: 'Design', desc: 'Custom water treatment system design tailored to your specific needs and budget.' },
            { icon: FaTools, title: 'Supply', desc: 'High-quality equipment and components sourced from trusted global manufacturers.' },
            { icon: FaIndustry, title: 'Installation', desc: 'Professional installation by our experienced technical team ensuring proper setup.' },
            { icon: FaShieldAlt, title: 'Maintenance', desc: 'Routine maintenance and dependable after-sales support for long-term reliability.' }
          ].map((item, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="p-4 rounded-4 h-100 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div className="d-flex align-items-center justify-content-center rounded-circle mb-3 mx-auto" style={{ width: '70px', height: '70px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '1.8rem' }}>
                  <item.icon />
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#0b2540' }}>{item.title}</h5>
                <p className="mb-0 small" style={{ color: '#718096', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Who We Serve */}
    <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3" style={{ color: '#0b2540' }}>
            Who We <span className="fst-italic" style={{ color: '#2fa5b6' }}>Serve</span>
          </h2>
          <p className="lead mx-auto" style={{ color: '#4a5568', maxWidth: '700px' }}>
            We deliver customized water solutions across diverse sectors and environments.
          </p>
        </div>

        <div className="row g-4">
          {[
            { icon: FaHome, title: 'Residential', desc: 'Homes and residential estates' },
            { icon: FaBuilding, title: 'Commercial', desc: 'Offices, hotels, and commercial facilities' },
            { icon: FaIndustry, title: 'Industrial', desc: 'Factories and manufacturing plants' },
            { icon: FaUsers, title: 'Institutional', desc: 'Schools, hospitals, and institutions' }
          ].map((client, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="p-4 rounded-4 text-center h-100" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="d-flex align-items-center justify-content-center rounded-circle mb-3 mx-auto" style={{ width: '60px', height: '60px', backgroundColor: '#ffffff', color: '#2fa5b6', fontSize: '1.5rem', border: '2px solid #2fa5b6' }}>
                  <client.icon />
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#0b2540' }}>{client.title}</h5>
                <p className="mb-0 small" style={{ color: '#718096' }}>{client.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-5" style={{ 
      backgroundImage: `linear-gradient(rgba(6, 17, 28, 0.85), rgba(6, 17, 28, 0.95)), url('/images/gallery-4.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="container py-5 text-center">
        <h2 className="display-5 fw-bold mb-4" style={{ color: '#ffffff' }}>Ready to transform your water quality?</h2>
        <p className="lead mb-5 mx-auto" style={{ color: '#cbd5e0', maxWidth: '700px' }}>
          Contact us today for a free water diagnosis and system design consultation.
        </p>
        <Link to="/contact" className="btn btn-light btn-lg rounded-pill px-5 fw-bold">
          Get Free Consultation
        </Link>
      </div>
    </section>
  </>
);

export default AboutSection;