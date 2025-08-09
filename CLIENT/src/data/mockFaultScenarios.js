/**
 * Mock Solar Panel Fault Prediction Scenarios
 * For testing different fault types and responses
 */

export const mockFaultScenarios = [
  {
    id: 1,
    name: "Micro-crack Detection",
    description: "Small cracks in solar cell structure",
    mockResponse: {
      predicted_class: "Micro-crack",
      confidence: 0.92,
      severity: "Medium",
      recommendations: [
        "Schedule immediate inspection of affected panel",
        "Monitor power output for degradation patterns",
        "Consider panel replacement if cracks expand",
        "Check surrounding panels for similar damage"
      ],
      tips: [
        "Micro-cracks often occur due to thermal stress",
        "Regular thermal imaging can detect early signs",
        "Proper installation reduces crack formation risk",
        "Document crack location for future reference"
      ],
      estimatedPowerLoss: "5-15%",
      urgency: "Medium",
      repairCost: "$200-400 per panel"
    }
  },
  {
    id: 2,
    name: "Hot Spot Formation",
    description: "Localized heating causing efficiency loss",
    mockResponse: {
      predicted_class: "Hot Spot",
      confidence: 0.89,
      severity: "High",
      recommendations: [
        "Immediate shutdown of affected panel required",
        "Check for shading or debris causing hot spots",
        "Inspect bypass diodes for proper function",
        "Clean panel surface thoroughly"
      ],
      tips: [
        "Hot spots can cause permanent panel damage",
        "Often caused by partial shading or soiling",
        "Thermal imaging reveals hot spot locations",
        "Bypass diodes help prevent hot spot formation"
      ],
      estimatedPowerLoss: "20-40%",
      urgency: "High",
      repairCost: "$150-300 per panel"
    }
  },
  {
    id: 3,
    name: "Surface Soiling",
    description: "Dirt, dust, or debris reducing light absorption",
    mockResponse: {
      predicted_class: "Soiling",
      confidence: 0.95,
      severity: "Low",
      recommendations: [
        "Clean panel surface with appropriate cleaning solution",
        "Establish regular cleaning schedule",
        "Check for nearby dust sources",
        "Consider anti-soiling coatings"
      ],
      tips: [
        "Regular cleaning maintains optimal performance",
        "Use deionized water for best results",
        "Clean during cooler parts of the day",
        "Automated cleaning systems available for large installations"
      ],
      estimatedPowerLoss: "2-10%",
      urgency: "Low",
      repairCost: "$50-100 cleaning service"
    }
  },
  {
    id: 4,
    name: "Glass Breakage",
    description: "Physical damage to panel glass surface",
    mockResponse: {
      predicted_class: "Glass Damage",
      confidence: 0.97,
      severity: "Critical",
      recommendations: [
        "Immediate panel replacement required",
        "Disconnect panel from system to prevent safety hazards",
        "Check for water ingress damage",
        "Inspect mounting system for stability"
      ],
      tips: [
        "Broken glass compromises panel safety and performance",
        "Water ingress can damage internal components",
        "Handle broken panels with extreme caution",
        "Proper disposal of damaged panels required"
      ],
      estimatedPowerLoss: "80-100%",
      urgency: "Critical",
      repairCost: "$300-600 panel replacement"
    }
  },
  {
    id: 5,
    name: "Delamination",
    description: "Separation of panel layers affecting performance",
    mockResponse: {
      predicted_class: "Delamination",
      confidence: 0.88,
      severity: "High",
      recommendations: [
        "Panel replacement recommended",
        "Monitor for moisture ingress",
        "Check warranty coverage",
        "Inspect other panels for similar issues"
      ],
      tips: [
        "Delamination often indicates manufacturing defects",
        "UV exposure and temperature cycling contribute to delamination",
        "Early detection prevents further degradation",
        "Warranty claims may cover delamination issues"
      ],
      estimatedPowerLoss: "15-30%",
      urgency: "High",
      repairCost: "$400-700 panel replacement"
    }
  },
  {
    id: 6,
    name: "Bird Dropping Damage",
    description: "Organic soiling causing localized shading",
    mockResponse: {
      predicted_class: "Bird Dropping",
      confidence: 0.91,
      severity: "Medium",
      recommendations: [
        "Clean affected area immediately",
        "Install bird deterrent systems",
        "Check for corrosion damage",
        "Increase cleaning frequency"
      ],
      tips: [
        "Bird droppings are acidic and can cause permanent staining",
        "Quick cleaning prevents etching damage",
        "Bird guards can prevent future issues",
        "Regular inspection of high-risk areas recommended"
      ],
      estimatedPowerLoss: "5-20%",
      urgency: "Medium",
      repairCost: "$75-150 cleaning + deterrents"
    }
  },
  {
    id: 7,
    name: "Corrosion Damage",
    description: "Metal component degradation affecting connections",
    mockResponse: {
      predicted_class: "Corrosion",
      confidence: 0.85,
      severity: "High",
      recommendations: [
        "Replace corroded components immediately",
        "Check all electrical connections",
        "Apply anti-corrosion treatments",
        "Improve drainage around panels"
      ],
      tips: [
        "Corrosion can cause electrical safety hazards",
        "Coastal installations are at higher risk",
        "Regular inspection of metal components essential",
        "Proper grounding prevents galvanic corrosion"
      ],
      estimatedPowerLoss: "10-25%",
      urgency: "High",
      repairCost: "$200-500 component replacement"
    }
  },
  {
    id: 8,
    name: "Shading Issues",
    description: "Partial shading reducing panel efficiency",
    mockResponse: {
      predicted_class: "Shading",
      confidence: 0.93,
      severity: "Medium",
      recommendations: [
        "Identify and remove shading sources",
        "Trim nearby vegetation",
        "Consider panel relocation if necessary",
        "Install power optimizers for shaded panels"
      ],
      tips: [
        "Even small shadows can significantly impact performance",
        "Seasonal shading patterns should be considered",
        "Power optimizers can minimize shading losses",
        "Regular vegetation management prevents shading issues"
      ],
      estimatedPowerLoss: "15-50%",
      urgency: "Medium",
      repairCost: "$100-300 vegetation management"
    }
  },
  {
    id: 9,
    name: "Junction Box Failure",
    description: "Electrical connection issues in junction box",
    mockResponse: {
      predicted_class: "Junction Box Fault",
      confidence: 0.87,
      severity: "Critical",
      recommendations: [
        "Immediate electrical inspection required",
        "Replace faulty junction box",
        "Check all electrical connections",
        "Test system grounding"
      ],
      tips: [
        "Junction box failures can cause fire hazards",
        "Moisture ingress is a common cause",
        "Regular thermal imaging can detect hot connections",
        "Professional electrical work required"
      ],
      estimatedPowerLoss: "50-100%",
      urgency: "Critical",
      repairCost: "$250-450 electrical repair"
    }
  },
  {
    id: 10,
    name: "Normal Panel Condition",
    description: "Panel operating within normal parameters",
    mockResponse: {
      predicted_class: "Normal",
      confidence: 0.96,
      severity: "None",
      recommendations: [
        "Continue regular maintenance schedule",
        "Monitor performance metrics",
        "Schedule next inspection in 6 months",
        "Document current condition for records"
      ],
      tips: [
        "Regular monitoring maintains optimal performance",
        "Preventive maintenance extends panel life",
        "Keep detailed maintenance records",
        "Seasonal performance variations are normal"
      ],
      estimatedPowerLoss: "0-2%",
      urgency: "None",
      repairCost: "No repair needed"
    }
  }
];

/**
 * Get a random mock fault scenario for testing
 */
export const getRandomFaultScenario = () => {
  const randomIndex = Math.floor(Math.random() * mockFaultScenarios.length);
  return mockFaultScenarios[randomIndex];
};

/**
 * Get fault scenario by ID
 */
export const getFaultScenarioById = (id) => {
  return mockFaultScenarios.find(scenario => scenario.id === id);
};

/**
 * Get fault scenarios by severity level
 */
export const getFaultScenariosBySeverity = (severity) => {
  return mockFaultScenarios.filter(scenario => 
    scenario.mockResponse.severity.toLowerCase() === severity.toLowerCase()
  );
};

/**
 * Simulate network delay for realistic testing
 */
export const simulateNetworkDelay = (ms = 1500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};