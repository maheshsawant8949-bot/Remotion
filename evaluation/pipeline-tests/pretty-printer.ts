import { DiffResult } from './diff-engine';

export class PrettyPrinter {
  static formatResult(scriptId: string, results: Record<string, DiffResult>): string {
    let output = `SCRIPT: ${scriptId}\n`;
    output += `-----------------------------------\n`;
    
    let allPass = true;

    for (const [key, result] of Object.entries(results)) {
        const icon = result.pass ? '✅' : '❌';
        // Format key to be readable (emotionalWeight -> Emotional Weight)
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        output += `${label}: ${String(result.actual).toUpperCase()} ${icon}`;
        
        if (!result.pass) {
            allPass = false;
            output += `\n  Expected: ${String(result.expected).toUpperCase()}`;
        }
        output += `\n`;
    }
    
    output += `\nRESULT: ${allPass ? 'PASS' : 'FAIL'}\n`;
    return output;
  }

  static printSummary(total: number, passed: number, failed: number) {
      console.log("\n===================================");
      console.log(`TOTAL: ${total}`);
      console.log(`PASS:  ${passed}`);
      console.log(`FAIL:  ${failed}`);
      console.log("===================================\n");
  }
}
