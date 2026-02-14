const fs = require('fs');
const path = require('path');

const COMPILED_PATH = path.join(__dirname, '../src/data/video-compiled.json');

// Color helpers
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  bold: "\x1b[1m"
};

function audit() {
  if (!fs.existsSync(COMPILED_PATH)) {
    console.error(`${colors.red}Error: File not found at ${COMPILED_PATH}${colors.reset}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(COMPILED_PATH, 'utf8'));
  const scenes = data.scenes;
  const total = scenes.length;

  console.log(`${colors.bold}=== CAMERA INTELLIGENCE AUDIT ===${colors.reset}`);
  console.log(`Total Scenes: ${total}\n`);

  // --- SHOT DISTRIBUTION ---
  const shots = {
    wide: 0,
    standard: 0,
    focus: 0,
    macro: 0
  };

  let consecutiveTightViolations = 0;
  let currentTightStreak = 0;
  let maxTightStreak = 0;
  let governorActiveCount = 0;

  scenes.forEach((scene, index) => {
    // Audit Shot Type
    const type = scene.trace?.cameraShot?.type || 'standard';
    if (shots[type] !== undefined) {
      shots[type]++;
    } else {
      shots.standard++; // Default
    }

    // Check Governor Application
    if (scene.trace?.cameraShot?.governorApplied) {
      governorActiveCount++;
    }

    // Check Consecutive Tight Shots (Focus/Macro)
    if (type === 'focus' || type === 'macro') {
      currentTightStreak++;
    } else {
      currentTightStreak = 0;
    }
    
    if (currentTightStreak > maxTightStreak) {
        maxTightStreak = currentTightStreak;
    }

    if (currentTightStreak > 2) {
        consecutiveTightViolations++;
    }
  });

  // --- REPORT DISTRIBUTION ---
  console.log(`${colors.cyan}Shot Distribution:${colors.reset}`);
  const targets = {
    standard: { min: 55, max: 70 },
    wide: { min: 15, max: 25 },
    focus: { min: 5, max: 12 },
    macro: { min: 0, max: 5 }
  };

  Object.entries(shots).forEach(([type, count]) => {
    const pct = ((count / total) * 100).toFixed(1);
    const target = targets[type];
    let status = `${colors.green}OK${colors.reset}`;
    
    // Allow slight deviation for small sample sizes, but warn if far off
    if (parseFloat(pct) < target.min) status = `${colors.yellow}LOW${colors.reset}`;
    if (parseFloat(pct) > target.max) status = `${colors.yellow}HIGH${colors.reset}`;
    
    console.log(`${type.padEnd(10)}: ${count.toString().padStart(2)} (${pct}%) Target: ${target.min}-${target.max}% [${status}]`);
  });

  // --- REPORT GOVERNANCE ---
  console.log(`\n${colors.cyan}Governance Checks:${colors.reset}`);
  console.log(`Governor Interventions: ${governorActiveCount}`);
  console.log(`Max Consecutive Tight Shots: ${maxTightStreak} (Limit: 2)`);
  
  if (consecutiveTightViolations > 0) {
      console.log(`${colors.red}❌ Consecutive tight shot limit exceeded ${consecutiveTightViolations} times.${colors.reset}`);
  } else {
      console.log(`${colors.green}✅ Consecutive tight shot limit respected.${colors.reset}`);
  }
}

audit();
