import { FaAward, FaShieldAlt, FaTools, FaUsers } from 'react-icons/fa';
import React from 'react';

/** Copy for the About page that is not shared with the rest of the site. */

export const CAPABILITIES = [
  { icon: <FaAward />, title: 'Certified equipment', description: 'Industry-grade systems and components with documented specifications.' },
  { icon: <FaUsers />, title: 'Every sector', description: 'Homes, businesses, schools, hospitals and industrial plants.' },
  { icon: <FaTools />, title: 'Installed and supported', description: 'Commissioning, servicing and spare parts handled by our own engineers.' },
  { icon: <FaShieldAlt />, title: 'Tested output', description: 'Treated water verified against Kenyan and WHO drinking water standards.' },
];

/** The "whole chain" described in the story paragraph, as steps. */
export const CHAIN_STEPS = [
  { title: 'Diagnosis', description: 'We test your actual water supply before recommending anything.' },
  { title: 'Design', description: 'A system sized around what is really in the water.' },
  { title: 'Supply', description: 'Certified equipment with documented specifications.' },
  { title: 'Installation', description: 'Fitted by our own engineers.' },
  { title: 'Commissioning', description: 'Output checked against Kenyan and WHO standards.' },
  { title: 'Servicing', description: 'Servicing and spare parts keep output within spec for years.' },
];
