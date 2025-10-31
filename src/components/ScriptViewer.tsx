import { useState } from 'react';
import { FileText, Upload, X } from 'lucide-react';

interface Script {
  name: string;
  content: string;
}

interface ScriptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultScripts: Script[];
}

export default function ScriptViewer({ isOpen, onClose, defaultScripts }: ScriptViewerProps) {
  const [scripts, setScripts] = useState<Script[]>(defaultScripts);
  const [selectedScript, setSelectedScript] = useState<Script | null>(
    defaultScripts[0] || null
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newScript = { name: file.name, content };
        setScripts([...scripts, newScript]);
        setSelectedScript(newScript);
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col border border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-green-400 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Script Viewer</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-4">
              <label className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload Script</span>
                <input
                  type="file"
                  accept=".sh,.bash"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="px-2 pb-2">
              {scripts.map((script, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedScript(script)}
                  className={`w-full text-left px-4 py-3 rounded text-sm transition-colors ${
                    selectedScript?.name === script.name
                      ? 'bg-gray-700 text-green-400'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{script.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {selectedScript ? (
              <div className="h-full">
                <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
                  <h3 className="font-mono text-sm text-gray-300">{selectedScript.name}</h3>
                </div>
                <pre className="p-6 text-sm font-mono text-green-400 bg-black h-full overflow-auto">
                  {selectedScript.content}
                </pre>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No script selected</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
