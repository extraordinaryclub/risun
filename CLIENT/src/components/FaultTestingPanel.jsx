import React, { useState } from 'react';
import { mockFaultScenarios, getRandomFaultScenario, simulateNetworkDelay } from '../data/mockFaultScenarios';

const FaultTestingPanel = ({ onScenarioSelect, isVisible = true }) => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isVisible) {
    console.log('🔍 FaultTestingPanel: Not visible, isVisible =', isVisible);
    return null;
  }
  
  console.log('🔍 FaultTestingPanel: Rendering with', mockFaultScenarios.length, 'scenarios');

  const handleScenarioTest = async (scenario) => {
    setIsLoading(true);
    setSelectedScenario(scenario);
    
    // Simulate network delay for realistic testing
    await simulateNetworkDelay(1000);
    
    // Call the parent component's handler with mock data
    if (onScenarioSelect) {
      onScenarioSelect(scenario.mockResponse, scenario.name);
    }
    
    setIsLoading(false);
  };

  const handleRandomTest = async () => {
    const randomScenario = getRandomFaultScenario();
    await handleScenarioTest(randomScenario);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      case 'none': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // When collapsed, show as a simple button
  if (isCollapsed) {
    return (
      <div 
        onClick={() => setIsCollapsed(false)}
        className="fixed top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full cursor-pointer font-bold text-sm transition-all duration-300 shadow-lg"
        style={{ zIndex: 99999 }}
        title="Click to expand testing panel"
      >
        🧪 Testing
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 w-80 bg-white border-4 border-red-500 rounded-lg shadow-2xl p-4 max-h-96 overflow-y-auto transition-all duration-300" style={{ zIndex: 99999, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-blue-600">🧪 Fault Testing Panel</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 px-2 py-1 rounded">TESTING BRANCH</span>
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors duration-200"
            title="Collapse to button"
          >
            ▲
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <>
          <div className="mb-4">
            <button
              onClick={handleRandomTest}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-2 disabled:opacity-50"
            >
              {isLoading ? '🔄 Testing...' : '🎲 Random Scenario'}
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 text-sm">Test Specific Scenarios:</h4>
            {mockFaultScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleScenarioTest(scenario)}
                disabled={isLoading}
                className={`w-full text-left p-2 rounded text-xs border hover:bg-gray-50 disabled:opacity-50 ${
                  selectedScenario?.id === scenario.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{scenario.name}</span>
                  <span className={`px-2 py-1 rounded text-white text-xs ${getSeverityColor(scenario.mockResponse.severity)}`}>
                    {scenario.mockResponse.severity}
                  </span>
                </div>
                <div className="text-gray-600 mt-1">{scenario.description}</div>
                <div className="text-gray-500 text-xs mt-1">
                  Confidence: {(scenario.mockResponse.confidence * 100).toFixed(0)}% | 
                  Power Loss: {scenario.mockResponse.estimatedPowerLoss}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <div>📊 Total Scenarios: {mockFaultScenarios.length}</div>
              <div>🔬 Branch: feat/fault-pred-variants</div>
              {selectedScenario && (
                <div className="mt-2 p-2 bg-gray-100 rounded">
                  <div className="font-medium">Last Tested:</div>
                  <div>{selectedScenario.name}</div>
                  <div>Confidence: {(selectedScenario.mockResponse.confidence * 100).toFixed(1)}%</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FaultTestingPanel;