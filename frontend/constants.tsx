import React from 'react';
import { Tool, Step } from './types';

export const STEPS: Step[] = [
  { id: 1, objective: "Prepare for the procedure", requiredTool: 'ppe', targetArea: 'avatar', progress: 15 },
  { id: 2, objective: "Position the gastric tube in the simulation", requiredTool: 'tube', targetArea: 'mouth', progress: 40 },
  { id: 3, objective: "Connect the lavage system", requiredTool: 'connector', targetArea: 'tube-end', progress: 55 },
  { id: 4, objective: "Complete the simulated lavage cycle (Fluid In)", requiredTool: 'fluid', targetArea: 'connector-hub', progress: 70 },
  { id: 5, objective: "Complete the simulated lavage cycle (Fluid Out)", requiredTool: 'container', targetArea: 'connector-hub', progress: 85 },
  { id: 6, objective: "Finish Procedure", requiredTool: 'finish', targetArea: 'any', progress: 100 },
];

// Simple SVG Icons to avoid external dependencies
const IconPPE = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const IconTube = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
    <path d="M4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4"></path>
    <path d="M8 4v16"></path>
    <path d="M16 4v16"></path>
    <path d="M4 8h16"></path>
    <path d="M4 16h16"></path>
  </svg>
);

const IconConnector = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
    <path d="M10 18v4"></path>
    <path d="M14 18v4"></path>
  </svg>
);

const IconFluid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
    <path d="M10 2v2"></path>
    <path d="M14 2v2"></path>
    <path d="M16 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"></path>
    <path d="M6 12h12"></path>
    <path d="M6 16h12"></path>
  </svg>
);

const IconContainer = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
    <path d="M4 6v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6"></path>
    <path d="M2 6h20"></path>
    <path d="M8 2h8v4H8z"></path>
  </svg>
);

const IconFinish = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export const TOOLS: Tool[] = [
  { id: 'ppe', name: 'Protective Equipment', icon: <IconPPE /> },
  { id: 'tube', name: 'Gastric Tube', icon: <IconTube /> },
  { id: 'connector', name: 'Connection Device', icon: <IconConnector /> },
  { id: 'fluid', name: 'Lavage Fluid', icon: <IconFluid /> },
  { id: 'container', name: 'Collection Container', icon: <IconContainer /> },
  { id: 'finish', name: 'Finish Procedure', icon: <IconFinish /> },
];
