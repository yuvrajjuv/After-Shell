import { useState, useEffect } from 'react';
import { FileCode, Menu, X } from 'lucide-react';
import Terminal from './components/Terminal';
import TaskPanel from './components/TaskPanel';
import ScriptViewer from './components/ScriptViewer';
import { BashSimulator } from './utils/bashSimulator';
import { tasks } from './data/tasks';
import { CommandOutput } from './types';

const simulator = new BashSimulator();

const defaultScripts = [
  {
    name: 'backup.sh',
    content: `#!/bin/bash
echo "Starting backup..."
tar -czf backup.tar.gz /home/user/documents`,
  },
  {
    name: 'deploy.sh',
    content: `#!/bin/bash
echo "Deploying application..."
npm run build
pm2 restart app`,
  },
  {
    name: 'system_check.sh',
    content: `#!/bin/bash
echo "=== System Health Check ==="
echo "Disk Usage:"
df -h | grep -v tmpfs
echo ""
echo "Memory Usage:"
free -h
echo ""
echo "CPU Load:"
uptime`,
  },
];

function App() {
  const [outputs, setOutputs] = useState<CommandOutput[]>([]);
  const [currentPath, setCurrentPath] = useState(simulator.getCurrentPath());
  const [currentTaskId, setCurrentTaskId] = useState(tasks[0].id);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [isScriptViewerOpen, setIsScriptViewerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentTask = tasks.find(t => t.id === currentTaskId);
    if (!currentTask) return;

    const lastOutput = outputs[outputs.length - 1];
    if (!lastOutput) return;

    if (
      currentTask.expectedCommand &&
      lastOutput.command.trim().toLowerCase() === currentTask.expectedCommand.toLowerCase() &&
      lastOutput.success &&
      !completedTasks.includes(currentTaskId)
    ) {
      setCompletedTasks([...completedTasks, currentTaskId]);

      setTimeout(() => {
        const nextTaskIndex = tasks.findIndex(t => t.id === currentTaskId) + 1;
        if (nextTaskIndex < tasks.length) {
          setCurrentTaskId(tasks[nextTaskIndex].id);
          setShowHints(false);
        }
      }, 1000);
    }
  }, [outputs, currentTaskId, completedTasks]);

  const handleCommand = (command: string) => {
    const output = simulator.executeCommand(command);
    setOutputs([...outputs, output]);
    setCurrentPath(simulator.getCurrentPath());
  };

  const handleClearTerminal = () => {
    setOutputs([]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 p-2 rounded">
            <FileCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-400">AfterQuery</h1>
            <p className="text-xs text-gray-400">Bash/Linux Expert Assessment</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsScriptViewerOpen(true)}
            className="hidden md:flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded transition-colors"
          >
            <FileCode className="w-4 h-4" />
            <span className="text-sm">View Scripts</span>
          </button>

          <button
            onClick={handleClearTerminal}
            className="hidden md:block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Clear Terminal
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-gray-200"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-96 border-r border-gray-800 absolute md:relative z-40 h-full md:h-auto bg-gray-900`}
        >
          <TaskPanel
            tasks={tasks}
            currentTaskId={currentTaskId}
            completedTasks={completedTasks}
            onTaskSelect={(id) => {
              setCurrentTaskId(id);
              setShowHints(false);
              setIsMobileMenuOpen(false);
            }}
            showHints={showHints}
            onToggleHints={() => setShowHints(!showHints)}
          />
        </aside>

        <main className="flex-1 overflow-hidden">
          <Terminal
            outputs={outputs}
            currentPath={currentPath}
            onCommand={handleCommand}
          />
        </main>
      </div>

      <footer className="bg-gray-900 border-t border-gray-800 px-6 py-3 text-center">
        <p className="text-xs text-gray-500">
          Completed: {completedTasks.length}/{tasks.length} tasks
          {completedTasks.length === tasks.length && (
            <span className="ml-2 text-green-400 font-semibold">Assessment Complete!</span>
          )}
        </p>
      </footer>

      <ScriptViewer
        isOpen={isScriptViewerOpen}
        onClose={() => setIsScriptViewerOpen(false)}
        defaultScripts={defaultScripts}
      />
    </div>
  );
}

export default App;
