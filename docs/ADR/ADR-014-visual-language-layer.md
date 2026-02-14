# ADR-014: Visual Language Layer

**Status**: Accepted  
**Date**: 2026-02-15  
**Context**: Autonomous Visual Narrative Engine

## Context

Without a strict design system, generated videos suffer from inconsistent styling, arbitrary values, and amateur aesthetics. Random font sizes, padding values, and mixed shape directions create visual chaos. We needed a principled visual language to ensure professional, consistent output.

## Decision

Implement a **Visual Language Layer** with strict design tokens across 5 categories:

### 1. Typography Scale

**6-level hierarchy** (no arbitrary sizes):

| Level    | Size | Usage                            |
| -------- | ---- | -------------------------------- |
| Display  | 96px | Hero moments, maximum impact     |
| Headline | 72px | Section headers, major divisions |
| Title    | 56px | Scene titles, primary content    |
| Body     | 40px | Main content, paragraphs         |
| Caption  | 32px | Supporting text, descriptions    |
| Micro    | 24px | Metadata, timestamps, labels     |

**Hard Rule**: All text must use these exact sizes.

### 2. Spacing System

**8px base unit** (all spacing is multiples):

| Level | Value | Usage         |
| ----- | ----- | ------------- |
| xs    | 8px   | Tight spacing |
| sm    | 16px  | Compact       |
| md    | 24px  | Standard      |
| lg    | 32px  | Comfortable   |
| xl    | 48px  | Spacious      |
| 2xl   | 64px  | Dramatic      |

**Hard Rule**: No random padding/margin values.

### 3. Color Roles

**9 semantic roles** (not specific colors):

- Primary: Main brand/action color
- Secondary: Supporting color
- Accent: Highlight/emphasis color
- Neutral: Text and borders
- Background: Page background
- Surface: Cards, panels
- Danger: Errors, warnings
- Success: Confirmations
- Warning: Cautions

**Hard Rule**: Components reference roles, not hex codes. Renderer maps roles to actual colors.

### 4. Contrast Rules

**WCAG AA accessibility** (automated validation):

- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- Interactive elements: 3:1 minimum

**Functions**:

- `getContrastRatio(fg, bg)`: Calculate contrast
- `validateTextContrast(fg, bg, size)`: Check validity
- `suggestAccessibleColor(fg, bg)`: Auto-fix low contrast

### 5. Shape Language

**Rounded direction** (modern, approachable):

| Level | Radius | Usage              |
| ----- | ------ | ------------------ |
| sm    | 8px    | Buttons, chips     |
| md    | 16px   | Cards, panels      |
| lg    | 24px   | Modals, containers |
| full  | 9999px | Pills, avatars     |

**Hard Rule**: Never mix rounded and sharp shapes.

## Consequences

### Positive

- **Consistency**: All generated videos use the same visual language
- **Professionalism**: No arbitrary values = polished output
- **Accessibility**: Automated contrast validation ensures readability
- **Maintainability**: Centralized tokens = easy updates
- **Explainability**: Semantic roles are self-documenting

### Negative

- **Rigidity**: Limited flexibility for edge cases
- **Learning Curve**: Developers must learn token system
- **Migration**: Existing code must be updated to use tokens

## Implementation

```
src/visual-language/
├── typography-scale.ts    # 6-level hierarchy
├── spacing-system.ts      # 8px base unit
├── color-roles.ts         # 9 semantic roles
├── contrast-rules.ts      # WCAG validation
├── shape-language.ts      # Rounded direction
└── index.ts               # Central export
```

### Usage Example

```typescript
import {
  getFontSize,
  getSpacing,
  colorRef,
  getBorderRadius,
} from "./visual-language";

const styles = {
  fontSize: getFontSize("title"), // 56px
  padding: getSpacing("md"), // 24px
  color: colorRef("primary"), // var(--color-primary-default)
  borderRadius: getBorderRadius("md"), // 16px
};
```

## Validation

**Token Coverage**:

- Typography: 6 levels ✅
- Spacing: 8 levels ✅
- Colors: 9 roles ✅
- Contrast: WCAG AA ✅
- Shapes: 5 radii ✅

**Status**: Token system complete. Renderer integration pending.

## Future Considerations

- **Theme Support**: Light/dark mode color mappings
- **Responsive Scale**: Adjust tokens for different screen sizes
- **Animation Tokens**: Duration, easing curves
- **Elevation System**: Shadow tokens for depth
