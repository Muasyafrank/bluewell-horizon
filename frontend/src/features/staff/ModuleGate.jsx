import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStaff } from './StaffContext';
import { homeFor } from './access';

/** Sends someone away from a section their role does not include (the API refuses them too). */
export default function ModuleGate({ module, children }) {
  const { me, can } = useStaff();
  if (!can(module)) return <Navigate to={homeFor(me?.modules)} replace />;
  return children;
}
