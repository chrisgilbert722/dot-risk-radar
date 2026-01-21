// FMCSA XML Parser
// Parses XML to normalized JSONB (NOT storing raw XML in DB)

import type { FMCSACarrierSnapshot, NormalizedDotProfile } from './types';

export class FMCSAParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FMCSAParseError';
  }
}

/**
 * Parse FMCSA XML to structured JSON
 * Uses browser DOMParser if available, otherwise xml2js or similar
 */
export function parseCarrierSnapshotXML(xmlText: string): FMCSACarrierSnapshot {
  try {
    // Simple XML parsing (can be replaced with xml2js or fast-xml-parser if needed)
    const getTagValue = (xml: string, tag: string): string | undefined => {
      const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`, 'i');
      const match = xml.match(regex);
      return match ? match[1].trim() : undefined;
    };

    const getTagNumber = (xml: string, tag: string): number | undefined => {
      const value = getTagValue(xml, tag);
      return value ? parseFloat(value) : undefined;
    };

    // Extract required fields
    const dotNumber = getTagValue(xmlText, 'DotNumber');
    if (!dotNumber) {
      throw new FMCSAParseError('Missing DOT number in FMCSA response');
    }

    const legalName = getTagValue(xmlText, 'LegalName') || '';

    // Parse all available fields
    const snapshot: FMCSACarrierSnapshot = {
      dotNumber,
      legalName,
      dbaName: getTagValue(xmlText, 'DbaName'),

      // Address
      phyStreet: getTagValue(xmlText, 'PhyStreet') || '',
      phyCity: getTagValue(xmlText, 'PhyCity') || '',
      phyState: getTagValue(xmlText, 'PhyState') || '',
      phyZipcode: getTagValue(xmlText, 'PhyZipcode') || '',

      // Status
      carrierOperation: getTagValue(xmlText, 'CarrierOperation') || 'UNKNOWN',
      entityType: getTagValue(xmlText, 'EntityType') || 'UNKNOWN',

      // Safety Rating
      safetyRating: getTagValue(xmlText, 'SafetyRating'),
      safetyRatingDate: getTagValue(xmlText, 'SafetyRatingDate'),

      // Out-of-Service counts
      vehicleOOS: getTagNumber(xmlText, 'VehicleOOS'),
      driverOOS: getTagNumber(xmlText, 'DriverOOS'),
      hazmatOOS: getTagNumber(xmlText, 'HazmatOOS'),
      totalVehicleInsp: getTagNumber(xmlText, 'TotalVehicleInsp'),
      totalDriverInsp: getTagNumber(xmlText, 'TotalDriverInsp'),
      totalHazmatInsp: getTagNumber(xmlText, 'TotalHazmatInsp'),

      // Equipment & Drivers
      totalPowerUnits: getTagNumber(xmlText, 'TotalPowerUnits'),
      totalDrivers: getTagNumber(xmlText, 'TotalDrivers'),
      totalInspections: getTagNumber(xmlText, 'TotalInspections'),
    };

    return snapshot;
  } catch (error) {
    if (error instanceof FMCSAParseError) {
      throw error;
    }
    throw new FMCSAParseError(
      `Failed to parse FMCSA XML: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Normalize FMCSA snapshot to dot_profiles schema
 * Returns data ready for upsert
 */
export function normalizeFMCSASnapshot(
  snapshot: FMCSACarrierSnapshot
): NormalizedDotProfile {
  // Calculate OOS rates (handle division by zero)
  const calculateOOSRate = (oos?: number, total?: number): number | null => {
    if (!oos || !total || total === 0) return null;
    return Math.round((oos / total) * 10000) / 100; // Round to 2 decimal places
  };

  const vehicleOOSRate = calculateOOSRate(
    snapshot.vehicleOOS,
    snapshot.totalVehicleInsp
  );
  const driverOOSRate = calculateOOSRate(
    snapshot.driverOOS,
    snapshot.totalDriverInsp
  );
  const hazmatOOSRate = calculateOOSRate(
    snapshot.hazmatOOS,
    snapshot.totalHazmatInsp
  );

  // Parse safety rating date
  let safetyRatingDate: Date | null = null;
  if (snapshot.safetyRatingDate) {
    try {
      safetyRatingDate = new Date(snapshot.safetyRatingDate);
      // Validate date
      if (isNaN(safetyRatingDate.getTime())) {
        safetyRatingDate = null;
      }
    } catch {
      safetyRatingDate = null;
    }
  }

  return {
    dot_number: snapshot.dotNumber,
    legal_name: snapshot.legalName || null,
    dba_name: snapshot.dbaName || null,
    physical_address: snapshot.phyStreet || null,
    physical_city: snapshot.phyCity || null,
    physical_state: snapshot.phyState || null,
    physical_zip: snapshot.phyZipcode || null,
    operating_status: snapshot.carrierOperation || null,
    entity_type: snapshot.entityType || null,
    fmcsa_safety_rating: snapshot.safetyRating || null,
    safety_rating_date: safetyRatingDate,
    vehicle_oos_rate: vehicleOOSRate,
    driver_oos_rate: driverOOSRate,
    hazmat_oos_rate: hazmatOOSRate,
    total_inspections: snapshot.totalInspections || 0,
    total_vehicles: snapshot.totalPowerUnits || 0,
    total_drivers: snapshot.totalDrivers || 0,
    raw_fmcsa_data: snapshot as object, // Store parsed JSON, not XML
    last_fetched_at: new Date(),
  };
}
