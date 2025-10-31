import { Task } from '../types';
import { CheckCircle2, Circle, Lightbulb } from 'lucide-react';

interface TaskPanelProps {
  tasks: Task[];
  currentTaskId: string;
  completedTasks: string[];
  onTaskSelect: (taskId: string) => void;
  showHints: boolean;
  onToggleHints: () => void;
}

export default function TaskPanel({
  tasks,
  currentTaskId,
  completedTasks,
  onTaskSelect,
  showHints,
  onToggleHints,
}: TaskPanelProps) {
  const currentTask = tasks.find(t => t.id === currentTaskId);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-green-400">Assessment Tasks</h2>
        <p className="text-sm text-gray-400 mt-1">
          Complete {completedTasks.length} of {tasks.length}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3 mb-6">
          {tasks.map(task => {
            const isCompleted = completedTasks.includes(task.id);
            const isCurrent = task.id === currentTaskId;

            return (
              <button
                key={task.id}
                onClick={() => onTaskSelect(task.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-gray-800 border-green-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{task.title}</h3>
                    {isCurrent && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {currentTask && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-green-400 mb-3">Current Task</h3>
            <h4 className="font-semibold mb-2">{currentTask.title}</h4>
            <p className="text-sm text-gray-300 mb-4">{currentTask.description}</p>

            {currentTask.hints && currentTask.hints.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={onToggleHints}
                  className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors mb-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {showHints ? 'Hide Hints' : 'Show Hints'}
                  </span>
                </button>

                {showHints && (
                  <div className="bg-gray-900 rounded p-3 space-y-2">
                    {currentTask.hints.map((hint, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-400 text-xs mt-0.5">•</span>
                        <span className="text-xs text-gray-300">{hint}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
