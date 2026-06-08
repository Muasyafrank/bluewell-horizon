import React from 'react';

const Gallery = () => (
  <section id="gallery" className="section-dark">
    <div className="container">
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="section-label">Gallery</div>
          <h2 className="section-title">Our work in action</h2>
          <p className="section-subtitle">
            Projects across residential estates, commercial facilities, and industrial plants.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className="col-md-4" key={item}>
            <div className="gallery-card-dark">
              <img 
                src={`https://images.unsplash.com/photo-${item % 2 === 0 ? '1581093458791-9f3c3900df4b' : '1541888946425-d81bb19240f5'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} 
                alt={`Project ${item}`}
              />
              <div className="card-body">
                <h6>Water Treatment Installation</h6>
                <p>Harambee Estate & Commercial Projects</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Gallery;