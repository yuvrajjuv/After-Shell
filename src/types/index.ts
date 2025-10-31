export interface Task {
  id: string;
  title: string;
  description: string;
  expectedCommand?: string;
  hints?: string[];
}

export interface CommandOutput {
  command: string;
  output: string;
  timestamp: Date;
  success: boolean;
}

export interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  permissions: string;
  size: number;
  content?: string;
  children?: FileSystemNode[];
}
