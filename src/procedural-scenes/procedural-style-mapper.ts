/**
 * Procedural Style Mapper
 * 
 * Map procedural visuals into Visual Style system.
 * 
 * This ensures:
 * - diagrams feel like part of the same world
 * - not a pasted infographic
 * 
 * Consistency is what makes channels look professional.
 */

import { Element, ElementStyle } from './element-factory';

/**
 * Style Profile
 */
export interface StyleProfile {
  name: string;
  colors: {
    background: string;
    surface: string;
    primaryText: string;
    secondaryText: string;
    accent: string;
    divider: string;
  };
  typography: {
    primaryFont: string;
    secondaryFont: string;
  };
  depth: {
    depth0: string;
    depth1: string;
    depth2: string;
  };
}

/**
 * Procedural Style Mapper
 */
export class ProceduralStyleMapper {
  /**
   * Map element to style profile
   */
  static mapToStyle(element: Element, profile: StyleProfile): Element {
    const styledElement = { ...element };
    
    // Apply color roles
    styledElement.style = {
      ...element.style,
      ...this.applyColorRoles(element, profile),
    };
    
    // Apply typography
    styledElement.style = {
      ...styledElement.style,
      ...this.applyTypography(element, profile),
    };
    
    // Apply depth system
    styledElement.style = {
      ...styledElement.style,
      ...this.applyDepth(element, profile),
    };
    
    return styledElement;
  }
  
  /**
   * Apply color roles from style profile
   */
  private static applyColorRoles(element: Element, profile: StyleProfile): Partial<ElementStyle> {
    const { type } = element;
    
    switch (type) {
      case 'node':
        return {
          backgroundColor: profile.colors.surface,
          borderColor: profile.colors.accent,
          textColor: profile.colors.primaryText,
        };
      
      case 'connector':
      case 'arrow':
        return {
          backgroundColor: 'transparent',
          borderColor: profile.colors.divider,
        };
      
      case 'bar':
        return {
          backgroundColor: profile.colors.accent,
          borderColor: 'transparent',
        };
      
      case 'label':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: profile.colors.primaryText,
        };
      
      case 'container':
        return {
          backgroundColor: profile.colors.background,
          borderColor: profile.colors.divider,
        };
      
      default:
        return {};
    }
  }
  
  /**
   * Apply typography from style profile
   */
  private static applyTypography(element: Element, profile: StyleProfile): Partial<ElementStyle> {
    if (element.type === 'label') {
      return {
        fontFamily: profile.typography.primaryFont,
      };
    }
    
    return {};
  }
  
  /**
   * Apply depth system from style profile
   */
  private static applyDepth(element: Element, profile: StyleProfile): Partial<ElementStyle> {
    const depth = element.style.depth || 0;
    
    const shadows = {
      0: profile.depth.depth0,
      1: profile.depth.depth1,
      2: profile.depth.depth2,
    };
    
    return {
      shadow: shadows[depth as keyof typeof shadows],
    };
  }
  
  /**
   * Get default style profile (editorial-modern)
   */
  static getDefaultProfile(): StyleProfile {
    return {
      name: 'editorial-modern',
      colors: {
        background: '#0F1419',
        surface: '#1A1F26',
        primaryText: '#E8EAED',
        secondaryText: '#9AA0A6',
        accent: '#5E8FD9',
        divider: '#2D3339',
      },
      typography: {
        primaryFont: 'Inter',
        secondaryFont: 'JetBrains Mono',
      },
      depth: {
        depth0: 'none',
        depth1: '0 1px 3px rgba(0,0,0,0.12)',
        depth2: '0 2px 6px rgba(0,0,0,0.16)',
      },
    };
  }
  
  /**
   * Batch map elements to style
   */
  static mapBatch(elements: Element[], profile: StyleProfile): Element[] {
    return elements.map(el => this.mapToStyle(el, profile));
  }
}
