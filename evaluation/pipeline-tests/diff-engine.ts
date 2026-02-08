
export type DiffResult = {
  pass: boolean;
  actual: any;
  expected: any;
  message?: string;
};

export class DiffEngine {
  /**
   * Compares an actual value against an expected value.
   * Expected can be a strict value or an array of allowed values.
   */
  static compare(actual: any, expected: any): DiffResult {
    // 1. Array Inclusion (Flexible Match)
    if (Array.isArray(expected)) {
      if (expected.includes(actual)) {
        return { pass: true, actual, expected };
      }
      return { 
        pass: false, 
        actual, 
        expected: expected.join(' | '),
        message: `Expected one of [${expected.join(', ')}] but got '${actual}'`
      };
    }

    // 2. Exact Match (Case insensitive for strings)
    if (typeof actual === 'string' && typeof expected === 'string') {
        if (actual.toLowerCase() === expected.toLowerCase()) {
            return { pass: true, actual, expected };
        }
    } else if (actual === expected) {
        return { pass: true, actual, expected };
    }

    return { 
      pass: false, 
      actual, 
      expected,
      message: `Expected '${expected}' but got '${actual}'`
    };
  }

  static validate(actual: any, expectedObj: any): Record<string, DiffResult> {
      const results: Record<string, DiffResult> = {};
      
      for (const key of Object.keys(expectedObj)) {
          if (actual[key] !== undefined) {
              results[key] = this.compare(actual[key], expectedObj[key]);
          } else {
              results[key] = { pass: false, actual: 'undefined', expected: expectedObj[key], message: `Field '${key}' missing in actual output` };
          }
      }
      return results;
  }
}
