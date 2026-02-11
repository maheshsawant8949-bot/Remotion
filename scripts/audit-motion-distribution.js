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

  console.log(`${colors.bold}=== MOTION & TRANSITION AUDIT ===${colors.reset}`);
  console.log(`Total Scenes: ${total}\n`);

  // --- MOTION BEHAVIORS ---
  const behaviors = {
    calm: 0,
    technical: 0,
    assertive: 0,
    energetic: 0
  };

  // --- TRANSITIONS ---
  const transitions = {
    soft: 0,
    firm: 0,
    release: 0,
    minimal: 0
  };

  let consecutiveFirmViolations = 0;
  let firmCapViolations = 0;

  scenes.forEach((scene, index) => {
    // Audit Motion
    const b = scene.trace?.motionBehavior?.behavior;
    if (b && behaviors[b] !== undefined) {
      behaviors[b]++;
    }

    // Audit Transitions (skip first scene as it has no transition)
    if (index > 0) {
      const t = scene.trace?.transitionFromPrevious?.type;
      if (t && transitions[t] !== undefined) {
        transitions[t]++;
      } else {
        // First scene or undefined usually implied soft
        transitions.soft++;
      }

      // Check constraints
      if (scene.trace?.transitionFromPrevious?.firmnessCapApplied) {
        firmCapViolations++;
      }
      if (scene.trace?.transitionFromPrevious?.consecutiveFirmPrevented) {
        consecutiveFirmViolations++;
      }
    }
  });

  // --- REPORT MOTION ---
  console.log(`${colors.cyan}Motion Distribution:${colors.reset}`);
  const motionTargets = {
    calm: { min: 55, max: 70 },
    technical: { min: 15, max: 25 },
    assertive: { min: 5, max: 12 },
    energetic: { min: 0, max: 5 }
  };

  Object.entries(behaviors).forEach(([type, count]) => {
    const pct = ((count / total) * 100).toFixed(1);
    const target = motionTargets[type];
    let status = `${colors.green}OK${colors.reset}`;
    
    if (parseFloat(pct) < target.min) status = `${colors.yellow}LOW${colors.reset}`;
    if (parseFloat(pct) > target.max) status = `${colors.yellow}HIGH${colors.reset}`;
    
    console.log(`${type.padEnd(10)}: ${count.toString().padStart(2)} (${pct}%) Target: ${target.min}-${target.max}% [${status}]`);
  });

  // --- REPORT TRANSITIONS ---
  console.log(`\n${colors.cyan}Transition Distribution:${colors.reset}`);
  // Targets based on heuristics
  // Firm capped at 15%
  // Soft should be majority
  
  const transitionTotal = total - 1; // Transitions are N-1
  
  Object.entries(transitions).forEach(([type, count]) => {
    const pct = ((count / transitionTotal) * 100).toFixed(1);
    let status = '';
    
    if (type === 'firm') {
       if (parseFloat(pct) <= 15) status = `${colors.green}OK (<=15%)${colors.reset}`;
       else status = `${colors.red}FAIL (>15%)${colors.reset}`;
    } else if (type === 'soft') {
       status = `${colors.dim}(Baseline)${colors.reset}`;
    }

    console.log(`${type.padEnd(10)}: ${count.toString().padStart(2)} (${pct}%) ${status}`);
  });

  console.log(`\n${colors.cyan}Transition Integrity Checks:${colors.reset}`);
  console.log(`Firm Cap Interventions: ${firmCapViolations}`);
  console.log(`Consecutive Firm Prevented: ${consecutiveFirmViolations}`);
  
  if (consecutiveFirmViolations > 0) {
      console.log(`${colors.green}✅ Consecutive firm constraint is active.${colors.reset}`);
  }
}

audit();
