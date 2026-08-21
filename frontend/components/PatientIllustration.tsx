import React from 'react';

interface Props {
  currentStepId: number;
  onTargetDrop: (targetId: string) => void;
  animationState: string;
}

export const PatientIllustration: React.FC<Props> = ({ currentStepId, onTargetDrop, animationState }) => {
  
  const handleMouseUp = (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation(); // Prevent global drop handler
    onTargetDrop(targetId);
  };

  // Determine visibility based on animation state
  const showTube = currentStepId > 2 || animationState === 'tube-inserting';
  const showConnector = currentStepId > 3 || animationState === 'connecting';
  const showFluidIn = animationState === 'fluid-in' || animationState === 'mixing';
  const showFluidOut = animationState === 'fluid-out';
  const showMixedFluid = animationState === 'mixing' || (currentStepId === 5 && animationState !== 'fluid-out');

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <svg viewBox="0 0 800 600" className="w-full h-full max-h-[60vh] drop-shadow-2xl">
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
          </radialGradient>
        </defs>

        {/* Background Grid for tech feel */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Patient Outline (Stylized Side View) */}
        <g stroke="#0ea5e9" strokeWidth="2" fill="url(#bodyGrad)" opacity="0.8">
          {/* Head & Torso */}
          <path d="M 500 100 C 550 100, 580 150, 580 220 C 580 260, 560 290, 530 310 L 530 550 L 250 550 L 250 310 C 220 290, 200 260, 200 220 C 200 100, 350 80, 500 100 Z" />
          {/* Nose/Mouth profile */}
          <path d="M 580 180 L 600 190 L 580 200 L 590 220 L 570 230" fill="none" />
        </g>

        {/* Anatomy (Transparent) */}
        <g stroke="#2dd4bf" strokeWidth="2" fill="rgba(45, 212, 191, 0.1)">
          {/* Esophagus */}
          <path d="M 570 220 Q 520 220, 500 280 T 480 400" fill="none" strokeWidth="16" strokeLinecap="round" />
          {/* Stomach */}
          <path d="M 470 390 C 470 390, 400 380, 360 420 C 320 460, 350 520, 420 520 C 480 520, 500 450, 490 400 Z" />
        </g>

        {/* Dynamic Elements */}
        
        {/* Gastric Tube */}
        {showTube && (
          <path 
            d="M 620 220 L 570 220 Q 520 220, 500 280 T 450 450" 
            fill="none" 
            stroke="#f8fafc" 
            strokeWidth="6" 
            strokeLinecap="round"
            className={animationState === 'tube-inserting' ? 'path-animate' : ''}
          />
        )}

        {/* Connector */}
        {showConnector && (
          <g transform="translate(620, 210)">
            <rect x="0" y="0" width="20" height="20" fill="#94a3b8" rx="4" />
            <rect x="20" y="5" width="10" height="10" fill="#cbd5e1" />
          </g>
        )}

        {/* Fluid Animations */}
        {showFluidIn && (
          <circle cx="420" cy="460" r="40" fill="#3b82f6" opacity="0.6">
            <animate attributeName="r" from="0" to="40" dur="1.5s" fill="freeze" />
            <animate attributeName="opacity" from="0" to="0.6" dur="1.5s" fill="freeze" />
          </circle>
        )}

        {showMixedFluid && (
          <g opacity="0.7">
            <circle cx="420" cy="460" r="40" fill="#6366f1" />
            {/* Particles */}
            <circle cx="400" cy="450" r="3" fill="#fff" className="animate-pulse" />
            <circle cx="430" cy="470" r="4" fill="#fff" className="animate-pulse" style={{animationDelay: '0.2s'}} />
            <circle cx="410" cy="480" r="2" fill="#fff" className="animate-pulse" style={{animationDelay: '0.4s'}} />
          </g>
        )}

        {showFluidOut && (
          <circle cx="420" cy="460" r="40" fill="#6366f1" opacity="0.7">
            <animate attributeName="r" from="40" to="0" dur="1.5s" fill="freeze" />
            <animate attributeName="opacity" from="0.7" to="0" dur="1.5s" fill="freeze" />
          </circle>
        )}

        {/* Interaction Targets (Invisible but clickable/droppable) */}
        
        {/* Mouth Target (Step 2) */}
        {currentStepId === 2 && (
          <g transform="translate(580, 220)" onMouseUp={(e) => handleMouseUp(e, 'mouth')} className="cursor-pointer">
            <circle cx="0" cy="0" r="40" fill="url(#glow)" className="animate-pulse-glow" />
            <circle cx="0" cy="0" r="20" fill="transparent" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4" className="animate-spin-slow" />
          </g>
        )}

        {/* Tube End Target (Step 3) */}
        {currentStepId === 3 && (
          <g transform="translate(620, 220)" onMouseUp={(e) => handleMouseUp(e, 'tube-end')} className="cursor-pointer">
            <circle cx="0" cy="0" r="40" fill="url(#glow)" className="animate-pulse-glow" />
            <rect x="-10" y="-10" width="20" height="20" fill="transparent" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4" />
          </g>
        )}

        {/* Connector Hub Target (Step 4 & 5) */}
        {(currentStepId === 4 || currentStepId === 5) && (
          <g transform="translate(640, 220)" onMouseUp={(e) => handleMouseUp(e, 'connector-hub')} className="cursor-pointer">
            <circle cx="0" cy="0" r="40" fill="url(#glow)" className="animate-pulse-glow" />
            <polygon points="0,-10 10,10 -10,10" fill="transparent" stroke="#06b6d4" strokeWidth="2" />
          </g>
        )}

      </svg>
    </div>
  );
};
