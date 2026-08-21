export type GameState = 'start' | 'playing' | 'completed';

export type ToolId = 'ppe' | 'tube' | 'connector' | 'fluid' | 'container' | 'finish';

export interface Tool {
  id: ToolId;
  name: string;
  icon: React.ReactNode;
}

export interface Step {
  id: number;
  objective: string;
  requiredTool: ToolId;
  targetArea: string;
  progress: number;
}

export interface Feedback {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}
