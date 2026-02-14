/**
 * Runtime Style Validator
 * 
 * Development-only validation to prevent hardcoded styling values.
 * Enforces visual language token usage at runtime.
 */

import React from 'react';

/**
 * Validate that styles use tokens instead of hardcoded values
 * Only runs in development mode
 * 
 * @param componentName - Name of the component for error reporting
 * @param styles - React CSS properties to validate
 */
export function validateStyles(
  componentName: string,
  styles: React.CSSProperties
): void {
  if (process.env.NODE_ENV !== 'development') return;

  const violations: string[] = [];

  // Check for hardcoded font sizes
  if (typeof styles.fontSize === 'number') {
    violations.push(
      `fontSize: ${styles.fontSize} (use getFontSize() or applyTypography())`
    );
  }

  // Check for hardcoded spacing
  const spacingProps = ['padding', 'margin', 'gap', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft'] as const;
  
  spacingProps.forEach((prop) => {
    const value = styles[prop as keyof React.CSSProperties];
    if (typeof value === 'number') {
      violations.push(
        `${prop}: ${value} (use getSpacing() or space())`
      );
    }
  });

  // Check for hardcoded colors (hex values)
  const colorProps = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'] as const;
  
  colorProps.forEach((prop) => {
    const value = styles[prop as keyof React.CSSProperties];
    if (typeof value === 'string' && value.startsWith('#')) {
      violations.push(
        `${prop}: ${value} (use colorRef() or theme colors)`
      );
    }
  });

  // Check for hardcoded border radius
  if (typeof styles.borderRadius === 'number') {
    violations.push(
      `borderRadius: ${styles.borderRadius} (use getBorderRadius())`
    );
  }

  // Check for hardcoded line height (numeric values)
  if (typeof styles.lineHeight === 'number') {
    violations.push(
      `lineHeight: ${styles.lineHeight} (use applyTypography())`
    );
  }

  // Report violations
  if (violations.length > 0) {
    console.error(
      `\n[Visual Language Violation] ${componentName}:\n` +
      violations.map(v => `  ❌ ${v}`).join('\n') +
      '\n'
    );
  }
}

/**
 * HOC to wrap a component with style validation
 * Use this during development to catch violations
 * 
 * @example
 * export const MyComponent = withStyleValidation('MyComponent', ({ style }) => (
 *   <div style={style}>...</div>
 * ));
 */
export function withStyleValidation<P extends { style?: React.CSSProperties }>(
  componentName: string,
  Component: React.ComponentType<P>
): React.FC<P> {
  const ValidatedComponent: React.FC<P> = (props: P) => {
    if (props.style) {
      validateStyles(componentName, props.style);
    }
    return React.createElement(Component, props);
  };
  
  return ValidatedComponent;
}
