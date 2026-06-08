import React from 'react';

const Gallery = () => (
  <section className="py-5">
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div style={{ width: '30px', height: '1px', background: '#2fa5b6' }}></div>
            <span className="text-uppercase small fw-bold" style={{ color: '#2fa5b6', letterSpacing: '3px' }}>Gallery</span>
          </div>
          <h2 className="display-5 fw-bold mb-3">Our work in action</h2>
          <p className="lead" style={{ color: '#95b5c4', maxWidth: '600px', fontWeight: '300' }}>
            Projects across residential estates, commercial facilities, and industrial plants.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className="col-md-4" key={item}>
            <div className="rounded-4 overflow-hidden h-100" style={{ 
              background: 'rgba(9, 28, 46, 0.5)',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.4s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(47, 165, 182, 0.3)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <img 
                src={`https://images.unsplash.com/photo-${item % 2 === 0 ? '1581093458791-9f3c3900df4b' : '1541888946425-d81bb19240f5'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} 
                alt={`Project ${item}`}
                className="w-100"
                style={{ height: '220px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
              <div className="p-4">
                <h6 className="fw-bold mb-1">Water Treatment Installation</h6>
                <p className="small mb-0" style={{ color: '#5a7a8c' }}>Harambee Estate & Commercial Projects</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Gallery;