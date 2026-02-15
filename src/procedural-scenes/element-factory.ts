/**
 * Element Factory
 * 
 * Generate components:
 * - nodes, connectors, arrows
 * - bars, rings, grids
 * - labels, icons, containers
 * 
 * Each element must inherit:
 * - color roles
 * - shape language
 * - depth rules
 * 
 * No rogue styling allowed.
 * 
 * CRITICAL RULE: Prefer fewer elements.
 * Overcrowded diagrams scream automation.
 * Whitespace feels premium.
 */

/**
 * Element Type
 */
export type ElementType =
  | 'node'
  | 'connector'
  | 'arrow'
  | 'bar'
  | 'ring'
  | 'grid'
  | 'label'
  | 'icon'
  | 'container';

/**
 * Element
 */
export interface Element {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  style: ElementStyle;
  content?: string;
}

/**
 * Element Style
 */
export interface ElementStyle {
  // Color roles (from visual-language)
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  
  // Shape language (from visual-language)
  borderRadius?: number;
  borderWidth?: number;
  
  // Depth rules (from visual-style)
  depth?: 0 | 1 | 2;
  shadow?: string;
  
  // Typography (from visual-language)
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
}

/**
 * Element Factory
 */
export class ElementFactory {
  /**
   * Create element with inherited styling
   */
  static create(
    type: ElementType,
    config: {
      x: number;
      y: number;
      width: number;
      height: number;
      content?: string;
    }
  ): Element {
    return {
      id: this.generateId(),
      type,
      ...config,
      style: this.getDefaultStyle(type),
    };
  }
  
  /**
   * Get default style for element type
   */
  private static getDefaultStyle(type: ElementType): ElementStyle {
    // Import from visual-language and visual-style modules
    // Using editorial-modern color palette and depth system
    
    const baseStyle: ElementStyle = {
      // Color roles (from visual-language/color-roles)
      backgroundColor: '#1A1F26',  // surface
      borderColor: '#2D3339',      // divider
      textColor: '#E8EAED',        // primaryText
      
      // Shape language
      borderRadius: 8,
      borderWidth: 1,
      
      // Depth (from visual-style/depth-system)
      depth: 1,
      shadow: '0 1px 3px rgba(0,0,0,0.12)',  // depth-1
      
      // Typography
      fontSize: 16,
      fontWeight: 400,
      fontFamily: 'Inter',
    };
    
    // Type-specific overrides
    switch (type) {
      case 'node':
        return {
          ...baseStyle,
          backgroundColor: '#1A1F26',
          borderColor: '#5E8FD9',  // accent
          borderWidth: 2,
          depth: 1,
        };
      
      case 'connector':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: '#2D3339',
          borderWidth: 2,
          depth: 0,
        };
      
      case 'arrow':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: '#5E8FD9',  // accent
          borderWidth: 2,
          depth: 0,
        };
      
      case 'bar':
        return {
          ...baseStyle,
          backgroundColor: '#5E8FD9',  // accent
          borderColor: 'transparent',
          borderRadius: 4,
          depth: 1,
        };
      
      case 'ring':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: '#5E8FD9',  // accent
          borderWidth: 3,
          borderRadius: 9999,  // circle
          depth: 0,
        };
      
      case 'grid':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: '#2D3339',
          borderWidth: 1,
          depth: 0,
        };
      
      case 'label':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: '#E8EAED',  // primaryText
          fontSize: 14,
          fontWeight: 400,
          depth: 0,
        };
      
      case 'icon':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          depth: 0,
        };
      
      case 'container':
        return {
          ...baseStyle,
          backgroundColor: '#0F1419',  // background
          borderColor: '#2D3339',
          borderRadius: 12,
          depth: 2,
        };
      
      default:
        return baseStyle;
    }
  }
  
  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return `el-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Create node
   */
  static createNode(x: number, y: number, content: string): Element {
    return this.create('node', { x, y, width: 120, height: 60, content });
  }
  
  /**
   * Create connector
   */
  static createConnector(x1: number, y1: number, x2: number, y2: number): Element {
    return this.create('connector', {
      x: x1,
      y: y1,
      width: x2 - x1,
      height: y2 - y1,
    });
  }
  
  /**
   * Create arrow
   */
  static createArrow(x1: number, y1: number, x2: number, y2: number): Element {
    return this.create('arrow', {
      x: x1,
      y: y1,
      width: x2 - x1,
      height: y2 - y1,
    });
  }
  
  /**
   * Create bar
   */
  static createBar(x: number, y: number, width: number, height: number): Element {
    return this.create('bar', { x, y, width, height });
  }
  
  /**
   * Create label
   */
  static createLabel(x: number, y: number, content: string): Element {
    return this.create('label', { x, y, width: 100, height: 20, content });
  }
}
