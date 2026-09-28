import React, { useMemo, useState } from 'react';
import { FaImages } from 'react-icons/fa';
import { catalogApi } from '../api';
import { useApiResource } from '../hooks';
import { SEO, Image } from '../components/common';
import { PageBanner } from '../components/layout';
import { AsyncSection, Card, EmptyState } from '../components/ui';

const ALL = 'All projects';

export default function Gallery() {
  const [category, setCategory] = useState(ALL);
  const { data, loading, error, reload } = useApiResource(
    (options) => catalogApi.listGallery(options),
    { initialData: [] },
  );

  const items = useMemo(() => data || [], [data]);

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

      <PageBanner
        eyebrow="Our work"
        title="Installations across Kenya"
        lead="Residential estates, commercial facilities and industrial plants we have delivered and continue to service."
      />

      <section className="bw-section">
        <div className="container">
          <AsyncSection
            loading={loading}
            error={error}
            onRetry={reload}
            loadingText="Loading projects"
            isEmpty={items.length === 0}
            empty={
              <EmptyState
                icon={<FaImages />}
                title="No projects published yet"
                description="Completed installations are added here as they are photographed."
              />
            }
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
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="row g-4">
              {visible.map((item) => (
                <div className="col-sm-6 col-lg-4 col-xl-3" key={item.id}>
                  <Card flush>
                    <Image src={item.image} alt={item.title} className="bw-card__media" />
                    <div className="bw-card__body">
                      <h2 className="bw-card__title mb-1" style={{ fontSize: '0.9375rem' }}>
                        {item.title}
                      </h2>
                      <p className="small text-muted mb-0">{item.category}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </AsyncSection>
        </div>
      </section>
    </>
  );
}
