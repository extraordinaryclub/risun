const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

// filename → detailed analysis map
const scenarios = {
  "cracked.jpg": {
    label: "Cracked Panel Glass",
    confidence: 0.9234,
    severity: "High",
    cause: "Physical impact or installation stress",
    analysis: "Fractures allow moisture ingress and raise short circuit risk. Efficiency drops and safety risk rises.",
    recommendedAction: "Replace the module. Inspect neighbors for micro-cracks.",
    impact: "35 to 40 percent output loss."
  },
  "dust.jpg": {
    label: "Dust Accumulation",
    confidence: 0.8711,
    severity: "Medium",
    cause: "Dry windy conditions and no cleaning cycle",
    analysis: "Dust blocks irradiance and creates uneven heating that can lead to hot spots over time.",
    recommendedAction: "Soft brush and deionized water clean. Add a quarterly cleaning schedule.",
    impact: "12 to 18 percent output loss."
  },
  "discoloration.jpg": {
    label: "Surface Discoloration",
    confidence: 0.7821,
    severity: "Medium",
    cause: "UV aging and pollutants",
    analysis: "Non uniform absorption causes uneven current flow and gradual loss.",
    recommendedAction: "Track output. Replace if degradation exceeds 20 percent vs baseline.",
    impact: "10 to 15 percent loss."
  },
  "microcracks.jpg": {
    label: "Micro Cracks",
    confidence: 0.8435,
    severity: "Medium",
    cause: "Thermal cycling or handling damage",
    analysis: "Cracks disrupt electron paths and can form hot spots. Often needs IR scan to confirm.",
    recommendedAction: "Schedule IR scan. Replace modules with active hot spots.",
    impact: "8 to 14 percent loss now, can worsen over 12 months."
  },
  "loosewiring.jpg": {
    label: "Loose Wiring",
    confidence: 0.8089,
    severity: "High",
    cause: "Poor terminations or vibration",
    analysis: "Intermittent connections cause voltage drop, inverter faults, and arc risk.",
    recommendedAction: "Shut down section, re tighten terminals, verify voltage under load.",
    impact: "20 to 30 percent loss. Safety hazard."
  },
  "delamination.jpg": {
    label: "Delamination",
    confidence: 0.8922,
    severity: "High",
    cause: "Adhesive breakdown from heat or moisture",
    analysis: "Air and moisture ingress corrodes cells and weakens structure. Fast decline expected.",
    recommendedAction: "Replace the module. Check batch for repeat issues.",
    impact: "25 to 35 percent loss and accelerating."
  },
  "shadow.jpg": {
    label: "Shadow Obstruction",
    confidence: 0.7598,
    severity: "Low",
    cause: "Trees or nearby structures",
    analysis: "Series wiring means a small shadow can drag down the string.",
    recommendedAction: "Trim source or move panel. Consider optimizers or microinverters.",
    impact: "5 to 12 percent loss depending on hours shaded."
  },
  "hotspots.jpg": {
    label: "Hot Spots",
    confidence: 0.8284,
    severity: "Medium",
    cause: "Defective cells, solder faults, or patterned shade",
    analysis: "Local overheating damages material and can spread. Fire risk if severe.",
    recommendedAction: "IR thermal scan. Replace or repair affected modules.",
    impact: "15 to 20 percent loss on the panel."
  },
  "bypass.jpg": {
    label: "Bypass Diode Failure",
    confidence: 0.8012,
    severity: "High",
    cause: "Aging or surge damage",
    analysis: "Failed diode breaks current path under shade and lowers string voltage.",
    recommendedAction: "Replace the diode and test adjacent diodes.",
    impact: "20 to 30 percent drop when shaded."
  },
  "normal.jpg": {
    label: "No Fault Detected",
    confidence: 0.9541,
    severity: "None",
    cause: "N/A",
    analysis: "Performance matches expected range for current weather and irradiance.",
    recommendedAction: "Keep the current cleaning and inspection cadence.",
    impact: "No measurable loss."
  }
};

app.post('/predict', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  const fileName = req.file.originalname.toLowerCase();
  const scenario = scenarios[fileName];

  if (!scenario) return res.status(403).json({ error: "API key expired" });

  res.json({ status: "success", ...scenario });
});

app.listen(5000, () => console.log("Mock server running on http://localhost:5000"));