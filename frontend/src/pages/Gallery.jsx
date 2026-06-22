import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/gallery')
      .then(res => res.json())
      .then(data => setGallery(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      {/* Header */}
      <section className="py-5" style={{ backgroundImage: `linear-gradient(rgba(6, 17, 28, 0.7), rgba(6, 17, 28, 0.9)), url('/images/bg-header.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px', display: 'flex', alignItems: 'center' }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#ffffff' }}>Our Gallery</h1>
          <p className="lead mb-0" style={{ color: '#cbd5e0' }}>Projects across residential estates, commercial facilities, and industrial plants.</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="row g-4">
            {gallery.map((item) => (
              <div className="col-md-4 col-lg-3" key={item.id}>
                <div className="rounded-4 overflow-hidden" style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <div style={{ overflow: 'hidden', height: '220px' }}>
                    <img src={item.image} alt={item.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="p-3">
                    <h6 className="fw-bold mb-1" style={{ color: '#0b2540', fontSize: '0.95rem' }}>{item.title}</h6>
                    <p className="mb-0 small" style={{ color: '#718096' }}>{item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Gallery;