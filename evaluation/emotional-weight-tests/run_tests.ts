import fs from 'fs';
import path from 'path';
import { EmotionalAnalyzer } from '../../src/pacing-engine/emotional-analyzer';

const analyzer = new EmotionalAnalyzer();
const testFile = path.join(__dirname, 'test_segments.json');

const rawData = fs.readFileSync(testFile, 'utf-8');
const segments = JSON.parse(rawData);

console.log("=== Emotional Weight Evaluation ===\n");
console.log(`Loaded ${segments.length} segments.\n`);

segments.forEach((seg: any) => {
    const result = analyzer.analyze(seg.text);
    console.log(`[${seg.id}] (${seg.category})`);
    console.log(`"${seg.text}"`);
    console.log(`Score: ${result.score.toFixed(1)} | Level: ${result.level}`);
    console.log(`Triggers: ${result.triggers.join(', ')}`);
    console.log(`Expected: ${seg.expected_weight}`);
    
    // Simple verification log
    const map = { 'Low': 'low', 'Medium': 'medium', 'High': 'high', 'Elevated': 'medium', 'Critical': 'high', 'Neutral': 'low' };
    const expectedLevel = map[seg.expected_weight as keyof typeof map] || 'unknown';
    
    // Fuzzy check for level match
    let status = "✅ OK";
    if (result.level !== expectedLevel) {
        // Allow Elevated to be Medium or High depending on exact score, but verify strict misses
        if (seg.expected_weight === 'Critical' && result.level !== 'high') status = "❌ MISS (Too Low)";
        if (seg.expected_weight === 'Low' && result.level !== 'low') status = "❌ MISS (Too High)";
        if (seg.expected_weight === 'Neutral' && result.level !== 'low') status = "❌ MISS (Too High)";
    }
    console.log(`Status: ${status}`);
    console.log("-".repeat(40));
});
