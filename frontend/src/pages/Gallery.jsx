import React from 'react';

const Gallery = () => (
  <>
    {/* Page Header */}
    <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container py-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
          <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>
            Gallery
          </span>
        </div>
        <h1 className="display-4 fw-bold mb-4" style={{ color: '#0b2540', lineHeight: 1.2, maxWidth: '800px' }}>
          Our work in <span className="fst-italic" style={{ color: '#2fa5b6' }}>action.</span>
        </h1>
        <p className="lead mb-0" style={{ color: '#4a5568', maxWidth: '700px' }}>
          Projects across residential estates, commercial facilities, and industrial plants.
        </p>
      </div>
    </section>

    {/* Gallery Grid */}
    <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
      <div className="container py-5">
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
            <div className="col-md-4 col-lg-3" key={item}>
              <div 
                className="rounded-4 overflow-hidden h-100" 
                style={{ 
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
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
                <div style={{ overflow: 'hidden', height: '220px' }}>
                  <img 
                    src={`/images/gallery-${item}.png`} 
                    alt={`Project ${item}`} 
                    className="w-100 h-100"
                    style={{ 
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease' 
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                </div>
                {/* <div className="p-3 mt-auto">
                  <h6 className="fw-bold mb-1" style={{ color: '#0b2540', fontSize: '0.95rem' }}>
                    Water Treatment Project {item}
                  </h6>
                  <p className="mb-0 small" style={{ color: '#718096' }}>
                    Professional Installation & Setup
                  </p>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Gallery;