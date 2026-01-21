#!/usr/bin/env tsx
/**
 * FMCSA Integration Test Script
 * Tests the complete FMCSA data fetching and risk scoring flow
 *
 * Usage: npx tsx scripts/test-fmcsa.ts [DOT_NUMBER]
 */

import { fetchAndStoreDotProfile } from '../lib/fmcsa/provider';
import { assessDotRisk, getLatestRiskSnapshot } from '../lib/risk/engine';

const TEST_DOT_NUMBER = process.argv[2] || '3962493'; // Example: Schneider National

async function testFMCSAIntegration() {
  console.log('🚀 DOT Risk Radar - FMCSA Integration Test\n');

  const dotNumber = TEST_DOT_NUMBER;
  console.log(`Testing DOT Number: ${dotNumber}\n`);

  try {
    // Step 1: Fetch FMCSA Data
    console.log('Step 1: Fetching FMCSA data...');
    const fetchResult = await fetchAndStoreDotProfile(dotNumber);

    if (!fetchResult.success) {
      console.error('❌ FMCSA fetch failed:', fetchResult.userMessage);
      console.error('   Error:', fetchResult.error);
      process.exit(1);
    }

    console.log('✅ FMCSA data fetched successfully');
    console.log(`   Source: ${fetchResult.source}`);
    if (fetchResult.staleness) {
      console.log(`   Cache age: ${fetchResult.staleness.toFixed(1)} hours`);
    }

    const profile = fetchResult.data;
    console.log('\n📋 Carrier Profile:');
    console.log(`   Legal Name: ${profile.legal_name}`);
    console.log(`   DBA Name: ${profile.dba_name || 'N/A'}`);
    console.log(`   Location: ${profile.physical_city}, ${profile.physical_state}`);
    console.log(`   Operating Status: ${profile.operating_status}`);
    console.log(`   FMCSA Safety Rating: ${profile.fmcsa_safety_rating || 'Not Rated'}`);
    console.log(`   Vehicle OOS Rate: ${profile.vehicle_oos_rate ? profile.vehicle_oos_rate.toFixed(2) + '%' : 'N/A'}`);
    console.log(`   Driver OOS Rate: ${profile.driver_oos_rate ? profile.driver_oos_rate.toFixed(2) + '%' : 'N/A'}`);
    console.log(`   Total Inspections: ${profile.total_inspections}`);

    // Step 2: Calculate Risk Assessment
    console.log('\nStep 2: Calculating risk assessment...');
    const riskSnapshot = await assessDotRisk(dotNumber);

    console.log('✅ Risk assessment complete');
    console.log('\n⚠️  Risk Assessment:');
    console.log(`   Risk Level: ${riskSnapshot.risk_level}`);
    console.log(`   Risk Score: ${riskSnapshot.risk_score}/100`);
    console.log(`   Snapshot Date: ${riskSnapshot.snapshot_date}`);

    console.log('\n📌 Risk Factors:');
    if (riskSnapshot.reasons.length === 0) {
      console.log('   No significant risk factors identified');
    } else {
      riskSnapshot.reasons.forEach((reason, i) => {
        console.log(`   ${i + 1}. ${reason}`);
      });
    }

    console.log('\n💡 Recommended Actions:');
    if (riskSnapshot.actions.length === 0) {
      console.log('   No actions required');
    } else {
      riskSnapshot.actions.forEach((action, i) => {
        console.log(`   ${i + 1}. ${action}`);
      });
    }

    // Step 3: Verify Latest Snapshot
    console.log('\nStep 3: Verifying stored snapshot...');
    const latestSnapshot = await getLatestRiskSnapshot(dotNumber);

    if (!latestSnapshot) {
      console.error('❌ Failed to retrieve latest snapshot');
      process.exit(1);
    }

    console.log('✅ Latest snapshot retrieved');
    console.log(`   Snapshot ID: ${latestSnapshot.id}`);
    console.log(`   Created At: ${latestSnapshot.created_at}`);

    // Success
    console.log('\n✅ All tests passed! FMCSA integration working correctly.\n');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run tests
testFMCSAIntegration();
