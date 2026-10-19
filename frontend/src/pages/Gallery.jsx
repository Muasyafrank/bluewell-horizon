import React, { useMemo, useState } from 'react';
import { useGalleryItems } from '../hooks';
import { Reveal, SEO } from '../components/common';
import { AsyncSection } from '../components/ui';
import CtaBand from '../components/marketing/CtaBand';
import PageHero from '../components/marketing/PageHero';
import ProjectTile from '../components/marketing/ProjectTile';

const ALL = 'All projects';

export default function Gallery() {
  const [category, setCategory] = useState(ALL);
  const { items, loading, reload } = useGalleryItems();

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(items.map((item) => item.category).filter(Boolean)))],
    [items],
  );

  const visible = useMemo(
    () => (category === ALL ? items : items.filter((item) => item.category === category)),
    [items, category],
  );

  return (
    <>
      <SEO
        title="Gallery"
        description="Water treatment installations across Kenya: industrial plants, commercial systems and residential solutions."
        path="/gallery"
      />

      <PageHero
        size="sm"
        eyebrow="Our work"
        title="Installations across Kenya"
        lead="Residential estates, commercial facilities and industrial plants we have delivered and continue to service."
        image="/images/gallery-3.png"
      />

      <section className="bw-section">
        <div className="container">
          <AsyncSection
            loading={loading}
            error={null}
            onRetry={reload}
            loadingText="Loading projects"
          >
            {categories.length > 2 ? (
              <ul className="bw-tabs" role="tablist" aria-label="Filter projects by category">
                {categories.map((name) => (
                  <li key={name} role="presentation">
                    <button
                      type="button"
                      role="tab"
                      className="bw-tab"
                      aria-selected={category === name}
                      onClick={() => setCategory(name)}
                    >
                      {name}
                      <span className="bw-tab__count">
                        {name === ALL ? items.length : items.filter((item) => item.category === name).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="row g-4">
              {visible.map((item, index) => (
                <Reveal className="col-sm-6 col-lg-4" index={index % 3} key={item.id}>
                  <ProjectTile item={item} />
                </Reveal>
              ))}
            </div>
          </AsyncSection>
        </div>
      </section>

      <CtaBand
        title="Have a similar project in mind?"
        lead="Tell us about your supply and your capacity needs. We will recommend a system and put together a costed proposal."
        primary={{ to: '/quote', label: 'Request a quote' }}
        secondary={{ to: '/contact', label: 'Talk to an engineer' }}
      />
    </>
  );
}
