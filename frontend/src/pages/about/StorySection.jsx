import React from 'react';
import { FaCogs } from 'react-icons/fa';
import { Image } from '../../components/common';
import { useReveal } from '../../hooks';
import { CAPABILITIES } from './content';

/** Photo collage on one side; the company story and capabilities on the other. */
export default function StorySection() {
  const collageRef = useReveal();
  const textRef = useReveal();

  return (
    <section className="bw-section bw-about-story">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div className="bw-collage bw-reveal" ref={collageRef}>
              <span className="bw-collage__ripple" aria-hidden="true" />
              <div className="bw-collage__main">
                <Image
                  src="/images/gallery-9.png"
                  alt="Twin blue pressure vessels on a steel frame in a treatment plant"
                  width="1038"
                  height="860"
                />
              </div>
              <Image
                src="/images/gallery-10.png"
                alt="Stainless steel filtration tanks with teal pipework"
                className="bw-collage__inset"
                width="1288"
                height="860"
              />
              <div className="bw-collage__badge">
                <span className="bw-collage__badge-icon" aria-hidden="true">
                  <FaCogs />
                </span>
                <span>
                  <strong>Diagnosis to servicing</strong>
                  <small>One team, start to finish</small>
                </span>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="bw-reveal" ref={textRef}>
              <p className="bw-eyebrow">Our approach</p>
              <h2 className="bw-about-story__title">Built around your water, not a catalogue</h2>
              <p className="bw-prose mb-3">
                Bluewell Horizon Limited supplies and maintains water treatment technology for
                residential, commercial, institutional and industrial clients. Every project starts
                with a test of your actual supply, because the right system depends on what is in
                the water rather than on what we happen to stock.
              </p>
              <p className="bw-prose mb-4">
                We handle the whole chain: diagnosis, system design, supply, installation,
                commissioning and the servicing that keeps output within spec for years afterwards.
              </p>

              <ul className="bw-capabilities">
                {CAPABILITIES.map((item) => (
                  <li key={item.title}>
                    <span className="bw-capabilities__icon" aria-hidden="true">{item.icon}</span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
