import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, ToolId, Feedback } from './types';
import { STEPS, TOOLS } from './constants';
import { PatientIllustration } from './components/PatientIllustration';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [score, setScore] = useState(1000);
  const [mistakes, setMistakes] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const [draggedTool, setDraggedTool] = useState<ToolId | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [animationState, setAnimationState] = useState<string>('idle');
  const [lavageProgress, setLavageProgress] = useState(0);

  const feedbackIdCounter = useRef(0);
  const currentStep = STEPS[currentStepIndex];

  // Timer
  useEffect(() => {
    let timer: number;
    if (gameState === 'playing') {
      timer = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Global Mouse Move for Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedTool) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleMouseUpGlobal = () => {
      if (draggedTool) {
        // If this fires and draggedTool is still set, it means it wasn't dropped on a valid target
        // (because valid targets call stopPropagation)
        handleMistake("Dropped in incorrect location");
        setDraggedTool(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUpGlobal);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [draggedTool]);

  const addFeedback = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = feedbackIdCounter.current++;
    setFeedbacks(prev => [...prev, { message, type, id }]);
    setTimeout(() => {
      setFeedbacks(prev => prev.filter(f => f.id !== id));
    }, 3000);
  }, []);

  const handleMistake = useCallback((msg: string) => {
    setScore(prev => Math.max(0, prev - 25));
    setMistakes(prev => prev + 1);
    addFeedback(msg, 'error');
  }, [addFeedback]);

  const advanceStep = useCallback(() => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setGameState('completed');
    }
  }, [currentStepIndex]);

  const handleToolMouseDown = (toolId: ToolId, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    
    // Special case for Step 1 (PPE) and Step 6 (Finish) - click to activate, no drag needed
    if (currentStep.id === 1 && toolId === 'ppe') {
      addFeedback("Preparation Complete ✓", 'success');
      advanceStep();
      return;
    }
    if (currentStep.id === 6 && toolId === 'finish') {
      advanceStep();
      return;
    }

    if (toolId !== currentStep.requiredTool) {
      handleMistake("Incorrect equipment selected");
      return;
    }

    setDraggedTool(toolId);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleTargetDrop = useCallback((targetArea: string) => {
    if (!draggedTool) return;

    if (targetArea === currentStep.targetArea && draggedTool === currentStep.requiredTool) {
      // Success
      setDraggedTool(null);
      
      // Handle specific animations based on step
      if (currentStep.id === 2) {
        setAnimationState('tube-inserting');
        addFeedback("Positioning tube...", 'info');
        setTimeout(() => {
          setAnimationState('idle');
          addFeedback("Tube Positioning Simulation Complete ✓", 'success');
          advanceStep();
        }, 2000);
      } else if (currentStep.id === 3) {
        addFeedback("Connection Secured ✓", 'success');
        advanceStep();
      } else if (currentStep.id === 4) {
        setAnimationState('fluid-in');
        addFeedback("Instilling fluid...", 'info');
        
        // Simulate progress bar for lavage
        let p = 0;
        const interval = setInterval(() => {
          p += 20;
          setLavageProgress(p);
          if (p >= 100) {
            clearInterval(interval);
            setAnimationState('mixing');
            addFeedback("Fluid instilled. Ready for collection.", 'success');
            setLavageProgress(0);
            advanceStep();
          }
        }, 300);
      } else if (currentStep.id === 5) {
        setAnimationState('fluid-out');
        addFeedback("Collecting fluid...", 'info');
        
        let p = 0;
        const interval = setInterval(() => {
          p += 20;
          setLavageProgress(p);
          if (p >= 100) {
            clearInterval(interval);
            setAnimationState('idle');
            addFeedback("Lavage Cycle Complete ✓", 'success');
            setLavageProgress(0);
            advanceStep();
          }
        }, 300);
      }
    } else {
      handleMistake("Incorrect position — try again");
      setDraggedTool(null);
    }
  }, [draggedTool, currentStep, advanceStep, addFeedback, handleMistake]);

  const resetGame = () => {
    setGameState('playing');
    setCurrentStepIndex(0);
    setScore(1000);
    setMistakes(0);
    setTimeElapsed(0);
    setAnimationState('idle');
    setFeedbacks([]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- Renderers ---

  if (gameState === 'start') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-slate-200 p-8 text-center">
        <div className="max-w-2xl border border-cyan-800 bg-slate-800/50 p-10 rounded-2xl shadow-2xl backdrop-blur-sm">
          <h2 className="text-cyan-500 font-bold tracking-widest text-sm mb-2">KASHMETA VIRTUAL MEDICAL UNIVERSITY</h2>
          <h1 className="text-4xl font-extrabold text-white mb-6">Gastric Lavage Simulator</h1>
          
          <div className="bg-red-900/20 border border-red-800/50 p-4 rounded-lg mb-8 text-red-200 text-sm">
            <strong>DISCLAIMER:</strong> Educational simulation only — simplified demonstration. Not for clinical training or patient care.
          </div>
          
          <p className="text-slate-400 mb-8 leading-relaxed">
            Welcome to the simulation. You will perform a simplified, conceptual demonstration of a gastric lavage procedure. 
            Follow the objectives, select the correct equipment, and interact with the patient illustration.
          </p>
          
          <button 
            onClick={() => setGameState('playing')}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          >
            START SIMULATION
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    const accuracy = Math.max(0, 100 - (mistakes * 5));
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-slate-200 p-8">
        <div className="max-w-2xl w-full border border-cyan-500 bg-slate-800 p-8 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Gastric Lavage Simulation Complete</h1>
          <p className="text-cyan-400 text-center mb-8">Skill Module: Emergency Medicine</p>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
              <div className="text-slate-400 text-sm">Score</div>
              <div className="text-3xl font-bold text-white">{score} <span className="text-sm text-slate-500">/ 1000</span></div>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
              <div className="text-slate-400 text-sm">Accuracy</div>
              <div className="text-3xl font-bold text-white">{accuracy}%</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
              <div className="text-slate-400 text-sm">Time</div>
              <div className="text-3xl font-bold text-white">{formatTime(timeElapsed)}</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
              <div className="text-slate-400 text-sm">XP Earned</div>
              <div className="text-3xl font-bold text-green-400">+250</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 border-b border-slate-700 pb-2">Procedure Sequence</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Preparation</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Tube Positioning Simulation</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Equipment Connection</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Lavage Demonstration</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Completion</li>
            </ul>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={resetGame} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded transition-colors">
              PLAY AGAIN
            </button>
            <button onClick={() => setGameState('start')} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded transition-colors">
              RETURN TO VIRTUAL UNIVERSITY
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className="h-full w-full flex flex-col bg-slate-900 text-slate-200 select-none">
      
      {/* Disclaimer Banner */}
      <div className="bg-slate-800 text-xs text-center py-1 text-slate-400 border-b border-slate-700">
        Educational simulation only — simplified demonstration. Not for clinical training or patient care.
      </div>

      {/* HUD */}
      <header className="h-16 bg-slate-800/80 border-b border-cyan-900 flex items-center justify-between px-6 backdrop-blur-md z-10">
        <div className="flex flex-col">
          <span className="text-xs text-cyan-500 font-bold tracking-wider">KASHMETA VIRTUAL MEDICAL UNIVERSITY</span>
          <div className="flex gap-4 text-sm">
            <span>Patient: <strong className="text-white">Alex</strong></span>
            <span className="text-slate-500">|</span>
            <span>Simulation: <strong className="text-white">Gastric Lavage</strong></span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-cyan-400 font-semibold">PROGRESS</span>
            <span>{currentStep.progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${currentStep.progress}%` }}
            />
          </div>
        </div>

        <div className="flex gap-6 text-right">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">SCORE</span>
            <span className="text-xl font-mono font-bold text-white">{score}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">TIME</span>
            <span className="text-xl font-mono font-bold text-white">{formatTime(timeElapsed)}</span>
          </div>
        </div>
      </header>

      {/* Main Gameplay Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        
        {/* Objective Banner */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 border border-cyan-700 px-6 py-3 rounded-full shadow-lg z-20 flex items-center gap-3 backdrop-blur-sm">
          <span className="text-cyan-400 font-bold text-sm">OBJECTIVE:</span>
          <span className="text-white font-medium">{currentStep.objective}</span>
        </div>

        {/* Lavage Cycle Progress (Specific to Step 4/5) */}
        {lavageProgress > 0 && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-blue-500 px-4 py-2 rounded z-20 flex flex-col items-center">
            <span className="text-xs text-blue-300 mb-1">SIMULATION CYCLE</span>
            <div className="font-mono text-blue-400">
              {'█'.repeat(Math.floor(lavageProgress / 10))}{'░'.repeat(10 - Math.floor(lavageProgress / 10))} {lavageProgress}%
            </div>
          </div>
        )}

        {/* Feedback Overlay */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none">
          {feedbacks.map(f => (
            <div 
              key={f.id} 
              className={`px-4 py-2 rounded shadow-lg animate-float-up font-bold text-center ${
                f.type === 'success' ? 'bg-green-900/80 text-green-300 border border-green-700' :
                f.type === 'error' ? 'bg-red-900/80 text-red-300 border border-red-700' :
                'bg-blue-900/80 text-blue-300 border border-blue-700'
              }`}
            >
              {f.message}
            </div>
          ))}
        </div>

        {/* Patient Illustration */}
        <PatientIllustration 
          currentStepId={currentStep.id} 
          onTargetDrop={handleTargetDrop}
          animationState={animationState}
        />

      </main>

      {/* Equipment Tray */}
      <footer className="h-36 bg-slate-800 border-t border-slate-700 p-4 flex flex-col z-30">
        <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">Equipment Tray</div>
        <div className="flex-1 flex items-center justify-center gap-4 overflow-visible">
          {TOOLS.map(tool => {
            const isRequired = tool.id === currentStep.requiredTool;
            const isDragged = tool.id === draggedTool;
            
            return (
              <div 
                key={tool.id}
                onMouseDown={(e) => handleToolMouseDown(tool.id, e)}
                className={`
                  relative flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all cursor-pointer
                  ${isDragged ? 'opacity-50 scale-95' : 'hover:-translate-y-2 hover:shadow-lg'}
                  ${isRequired ? 'border-cyan-500 bg-cyan-900/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse-glow' : 'border-slate-600 bg-slate-700/50 hover:border-slate-400'}
                `}
              >
                <div className={`mb-2 ${isRequired ? 'text-cyan-400' : 'text-slate-300'}`}>
                  {tool.icon}
                </div>
                <span className="text-[10px] text-center leading-tight px-1 font-medium text-slate-300">
                  {tool.name}
                </span>
              </div>
            );
          })}
        </div>
      </footer>

      {/* Drag Ghost Element */}
      {draggedTool && (
        <div 
          className="fixed pointer-events-none z-50 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ 
            left: mousePos.x, 
            top: mousePos.y,
            transform: 'translate(-50%, -50%) scale(1.2)'
          }}
        >
          {TOOLS.find(t => t.id === draggedTool)?.icon}
        </div>
      )}

    </div>
  );
};

export default App;
