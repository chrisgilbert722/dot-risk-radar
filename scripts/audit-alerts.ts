import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Scan codebase for hardcoded alert strings and toast usages.
 * Target patterns:
 * - toast.error("...")
 * - toast.success("...")
 * - toast("...")
 * - console.warn("...")
 * - <Alert>...</Alert> content
 */

const TARGET_DIRS = ['app', 'components', 'lib'];
const RISK_LEVELS = ['Low', 'Elevated', 'High']; // The ONLY allowed levels

interface AuditResult {
    file: string;
    line: number;
    type: 'toast' | 'console' | 'alert_component' | 'risk_term';
    content: string;
    suggestion?: string;
}

async function auditAlerts() {
    console.log('🔍 Starting Alert Language Audit...');
    console.log('-----------------------------------');

    const files = await glob('**/*.{ts,tsx}', {
        ignore: ['node_modules/**', '.next/**', 'scripts/**'],
        cwd: process.cwd(),
        absolute: true,
    });

    const findings: AuditResult[] = [];

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((lineText, index) => {
            const lineNum = index + 1;
            const cleanLine = lineText.trim();

            // Check for Toasts
            if (cleanLine.match(/toast\.(error|success|warning|info)\s*\(/) || cleanLine.includes('toast(')) {
                findings.push({
                    file: path.relative(process.cwd(), file),
                    line: lineNum,
                    type: 'toast',
                    content: cleanLine,
                    suggestion: 'Move string literal to lib/constants/messages.ts'
                });
            }

            // Check for Console Warnings
            if (cleanLine.includes('console.warn(') || cleanLine.includes('console.error(')) {
                findings.push({
                    file: path.relative(process.cwd(), file),
                    line: lineNum,
                    type: 'console',
                    content: cleanLine,
                    suggestion: 'Ensure this is a developer-only log, not user-facing.'
                });
            }

            // Check for Prohibited Risk Terminology
            const prohibitedTerms = ['Critical', 'Severe', 'Emergency', 'Extreme', 'Warning', 'Immediate'];

            // Skip lines that look like comments
            if (cleanLine.startsWith('//') || cleanLine.startsWith('/*') || cleanLine.startsWith('*')) {
                return;
            }

            prohibitedTerms.forEach(term => {
                // Regex matches whole words, case-insensitive
                const regex = new RegExp(`\\b${term}\\b`, 'i');
                if (regex.test(cleanLine)) {
                    findings.push({
                        file: path.relative(process.cwd(), file),
                        line: lineNum,
                        type: 'risk_term',
                        content: cleanLine,
                        suggestion: `PROHIBITED TERM: "${term}". Use "High", "Elevated", or "Low" only.`
                    });
                }
            });
        });
    }

    // Report Findings
    if (findings.length === 0) {
        console.log('✅ No hardcoded alerts or prohibited terms found.');
    } else {
        console.log(`⚠️ Found ${findings.length} potential issues:\n`);
        findings.forEach(f => {
            console.log(`[${f.type.toUpperCase()}] ${f.file}:${f.line}`);
            console.log(`   match: ${f.content}`);
            if (f.suggestion) console.log(`   💡 ${f.suggestion}`);
            console.log('');
        });
    }
}

auditAlerts().catch(console.error);
