import React from 'react';
import { FaCompass } from 'react-icons/fa';
import { SEO } from '../components/common';
import { Button, EmptyState } from '../components/ui';

/** 404 page. The app previously had no catch-all route, so an unknown URL
 *  rendered the layout with an empty body and no explanation. */
export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" noIndex path="/404" />
      <section className="bw-section bw-page">
        <div className="container">
          <EmptyState
            icon={<FaCompass />}
            title="That page does not exist"
            description="The link may be out of date. Start from the home page, or browse the shop and services."
            action={
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button to="/">Go to the home page</Button>
                <Button to="/services" variant="outline">
                  Browse services
                </Button>
              </div>
            }
          />
        </div>
      </section>
    </>
  );
}
