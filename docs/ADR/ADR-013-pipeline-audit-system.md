# ADR-013: Pipeline Audit System

**Status**: Accepted  
**Date**: 2026-02-15  
**Context**: Autonomous Visual Narrative Engine

## Context

As the system grew in complexity with multiple intelligence layers (Cognition, Directorial, Kinetic, Transitions, Camera), we needed a comprehensive health check system to validate that all governors and constraints are functioning correctly. **Inflation** (excessive use of intense behaviors) is the #1 killer of advanced pipelines.

## Decision

Implement a **Pipeline Audit System** that analyzes compiled videos and enforces hard safety thresholds across all intelligence layers.

### Audit Scope

**5 Intelligence Layers**:

1. **Cognition**: Emotion, density, strategy distributions
2. **Directorial**: Reveal types, emphasis levels, peak moments
3. **Kinetic**: Motion behaviors, streaks, volatility
4. **Transitions**: Transition type distributions
5. **Camera**: Shot types, tight shot streaks

### Hard Safety Checks

| Check            | Threshold | Rationale                   |
| ---------------- | --------- | --------------------------- |
| Energetic Motion | ≤ 5-7%    | Prevents kinetic fatigue    |
| Macro Shots      | ≤ 5%      | Prevents claustrophobia     |
| Strong Emphasis  | ≤ 12-15%  | Prevents emphasis inflation |
| Firm Transitions | ≤ 15-18%  | Prevents jarring pacing     |
| Focus Streak     | ≤ 2       | Prevents tight shot fatigue |
| Kinetic Streak   | ≤ 2       | Prevents motion fatigue     |

### Output Format

```
✅ PIPELINE HEALTH: PASS

SAFETY CHECKS
✅ Energetic Motion Inflation: 0.0% (Threshold: ≤ 5-7%)
✅ Macro Shot Inflation: 0.0% (Threshold: ≤ 5%)
...

COGNITION LAYER
Emotion Distribution:
  low     :  26 (100.0%)
...
```

### Status Levels

- **PASS**: All safety checks within thresholds
- **WARN**: Some checks in warning range (e.g., 5-7% energetic)
- **FAIL**: One or more checks exceed hard limits

## Consequences

### Positive

- **Inflation Detection**: Immediately identifies governor failures
- **Comprehensive**: Validates all 5 intelligence layers
- **Actionable**: Clear thresholds with pass/fail status
- **CI/CD Ready**: Exit codes for automated testing
- **Human Readable**: Clean report format (no JSON dumping)

### Negative

- **Maintenance**: Thresholds may need tuning per content type
- **False Positives**: Some content may legitimately exceed thresholds

## Implementation

- `evaluation/pipeline-audit.ts`: Main audit tool
- Extracts metrics from `video-compiled.json`
- Runs 6 hard safety checks
- Outputs formatted report
- Returns exit code 1 on failure

## Usage

```bash
# Audit current video
npx ts-node evaluation/pipeline-audit.ts

# Audit specific video
npx ts-node evaluation/pipeline-audit.ts path/to/video.json
```

## Validation

**Current Video (26 scenes)**:

- ✅ All 6 safety checks PASSED
- Energetic: 0.0% (Target: ≤ 5-7%)
- Macro: 0.0% (Target: ≤ 5%)
- Strong Emphasis: 0.0% (Target: ≤ 12-15%)
- Firm Transitions: 11.5% (Target: ≤ 15-18%)
- Focus Streak: 0 (Target: ≤ 2)
- Kinetic Streak: 1 (Target: ≤ 2)

**Status**: System stable. All governors functioning correctly.

## Future Considerations

- **Content-Specific Thresholds**: Different limits for different genres
- **Trend Analysis**: Track metrics over time
- **Automated Regression**: Run audit in CI/CD pipeline
