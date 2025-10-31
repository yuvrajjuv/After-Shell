import { useEffect, useRef } from 'react';
import { CommandOutput } from '../types';

interface TerminalProps {
  outputs: CommandOutput[];
  currentPath: string;
  onCommand: (command: string) => void;
}

export default function Terminal({ outputs, currentPath, onCommand }: TerminalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current.value.trim()) {
      onCommand(inputRef.current.value);
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-green-400 font-mono text-sm">
      <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-gray-400 text-xs">bash - Terminal</span>
      </div>

      <div ref={outputRef} className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="text-green-400 mb-4">
          <div>AfterQuery Bash/Linux Expert Assessment</div>
          <div>Type 'help' for available commands</div>
          <div className="text-gray-600">─────────────────────────────────</div>
        </div>

        {outputs.map((output, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-start">
              <span className="text-blue-400 mr-2">user@afterquery</span>
              <span className="text-yellow-400 mr-2">{currentPath}</span>
              <span className="text-gray-400 mr-2">$</span>
              <span className="text-white">{output.command}</span>
            </div>
            {output.output && (
              <pre className={`ml-2 mt-1 whitespace-pre-wrap ${output.success ? 'text-green-400' : 'text-red-400'}`}>
                {output.output}
              </pre>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
        <div className="flex items-center">
          <span className="text-blue-400 mr-2">user@afterquery</span>
          <span className="text-yellow-400 mr-2">{currentPath}</span>
          <span className="text-gray-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </form>
    </div>
  );
}
