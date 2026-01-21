# FMCSA Integration - Implementation Summary

## Migration Diff

### New Migration: `supabase/migrations/20260120_phase2_fmcsa.sql`

**Tables Created:**

1. **`dot_profiles`** - Stores FMCSA carrier snapshot data
   - Primary key: `id` (UUID)
   - Unique key: `dot_number` (TEXT)
   - Upsert by: `dot_number`
   - JSONB field: `raw_fmcsa_data` (parsed JSON, not XML string)
   - Cache field: `last_fetched_at` (for 12-hour rule)

2. **`risk_snapshots`** - Stores calculated risk assessments
   - Primary key: `id` (UUID)
   - Foreign key: `dot_number` → `dot_profiles(dot_number)`
   - Unique constraint: `(dot_number, snapshot_date)`
   - Fields match existing schema:
     - `snapshot_date` (date)
     - `risk_level` (High/Elevated/Low)
     - `risk_score` (0-100)
     - `reasons` (jsonb array)
     - `actions` (jsonb array)
     - `raw_payload` (jsonb)

**Indexes:**
- `idx_dot_profiles_dot_number` - Fast DOT lookup
- `idx_dot_profiles_last_fetched` - Cache refresh queries
- `idx_risk_snapshots_dot_number` - Latest snapshot queries
- `idx_risk_snapshots_date` - Date range queries

**RLS Policies:**
- Authenticated users: READ on both tables
- Service role: FULL access (for background jobs)

---

## Provider Mapping

### FMCSA XML → `dot_profiles` Table

| FMCSA XML Tag | dot_profiles Column | Transformation |
|---------------|---------------------|----------------|
| `<DotNumber>` | `dot_number` | Direct (string) |
| `<LegalName>` | `legal_name` | Trim whitespace |
| `<DbaName>` | `dba_name` | Null if empty |
| `<PhyStreet>` | `physical_address` | Direct |
| `<PhyCity>` | `physical_city` | Direct |
| `<PhyState>` | `physical_state` | Direct |
| `<PhyZipcode>` | `physical_zip` | Direct |
| `<CarrierOperation>` | `operating_status` | Direct |
| `<EntityType>` | `entity_type` | Direct |
| `<SafetyRating>` | `fmcsa_safety_rating` | Direct (nullable) |
| `<SafetyRatingDate>` | `safety_rating_date` | Parse to Date |
| `<VehicleOOS>` / `<TotalVehicleInsp>` | `vehicle_oos_rate` | Calculate % |
| `<DriverOOS>` / `<TotalDriverInsp>` | `driver_oos_rate` | Calculate % |
| `<HazmatOOS>` / `<TotalHazmatInsp>` | `hazmat_oos_rate` | Calculate % |
| `<TotalInspections>` | `total_inspections` | Direct (int) |
| `<TotalPowerUnits>` | `total_vehicles` | Direct (int) |
| `<TotalDrivers>` | `total_drivers` | Direct (int) |
| (Full parsed object) | `raw_fmcsa_data` | Store as JSONB |
| (Current timestamp) | `last_fetched_at` | Auto-generated |

### OOS Rate Calculation

```typescript
function calculateOOSRate(oos: number, total: number): number | null {
  if (!oos || !total || total === 0) return null;
  return Math.round((oos / total) * 10000) / 100; // 2 decimal places
}
```

Example:
- `VehicleOOS`: 5
- `TotalVehicleInsp`: 50
- Result: `vehicle_oos_rate` = 10.00%

---

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Request                             │
│              (Dashboard or API call)                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              FMCSA Provider                                 │
│         (lib/fmcsa/provider.ts)                             │
│                                                             │
│  1. Check cache (12-hour rule)                             │
│  2. If stale/missing → Fetch from FMCSA WebKey API         │
│  3. Parse XML → Normalized JSON                            │
│  4. Store in dot_profiles (upsert by dot_number)           │
│  5. Return DotProfile (NO risk scoring)                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Risk Engine                                    │
│          (lib/risk/engine.ts)                               │
│                                                             │
│  1. Read dot_profile from database                         │
│  2. Calculate risk_score (0-100)                           │
│  3. Categorize risk_level (High/Elevated/Low)              │
│  4. Identify reasons (plain English)                       │
│  5. Generate actions (recommendations)                     │
│  6. Store in risk_snapshots (upsert by dot_number + date)  │
│  7. Return RiskSnapshot                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Files

### Created Files:

1. **`supabase/migrations/20260120_phase2_fmcsa.sql`**
   - Database schema (dot_profiles, risk_snapshots)
   - Indexes and RLS policies

2. **`lib/fmcsa/types.ts`**
   - TypeScript types aligned with schema
   - FMCSA API response types

3. **`lib/fmcsa/client.ts`**
   - FMCSA WebKey API client
   - Error handling (404, 429, 5xx)
   - Retry logic with exponential backoff

4. **`lib/fmcsa/parser.ts`**
   - XML → JSON parsing
   - Normalization to dot_profiles schema
   - OOS rate calculation

5. **`lib/fmcsa/provider.ts`**
   - Main data provider
   - 12-hour cache logic
   - Fallback to cache on errors
   - Upsert to dot_profiles

6. **`lib/risk/engine.ts`**
   - Risk scoring algorithms
   - Risk level categorization
   - Reason/action generation
   - Upsert to risk_snapshots

### Modified Files:

7. **`.env.example`**
   - Added `FMCSA_WEBKEY` configuration

---

## Constraints Compliance

✅ **No SAFER HTML scraping** - WebKey API only
✅ **Fallback: cache → error** - No web scraping fallback
✅ **Existing tables** - Uses dot_profiles (UUID id, UNIQUE dot_number)
✅ **Existing risk_snapshots schema** - Uses snapshot_date, reasons, actions, raw_payload
✅ **Raw data as JSONB** - Parsed JSON stored, not XML strings
✅ **Inspection history optional** - v1 uses aggregate counts only
✅ **Separate provider & risk engine** - Clear separation of concerns
✅ **No "official" language** - Uses "FMCSA safety rating"
✅ **12-hour cache enforced** - Via last_fetched_at
✅ **Approved language only** - No real-time/enforcement claims

---

## Usage Examples

### Fetch FMCSA Data

```typescript
import { fetchAndStoreDotProfile } from '@/lib/fmcsa/provider';

const result = await fetchAndStoreDotProfile('123456');

if (result.success) {
  console.log(result.data); // DotProfile
  console.log(result.source); // 'fmcsa' or 'cache'
} else {
  console.error(result.userMessage); // User-friendly error
}
```

### Calculate Risk

```typescript
import { assessDotRisk } from '@/lib/risk/engine';

const riskSnapshot = await assessDotRisk('123456');

console.log(riskSnapshot.risk_level); // 'High' | 'Elevated' | 'Low'
console.log(riskSnapshot.risk_score); // 0-100
console.log(riskSnapshot.reasons); // ['Unsatisfactory FMCSA safety rating', ...]
console.log(riskSnapshot.actions); // ['Review vehicle maintenance procedures', ...]
```

### Dashboard Integration

```typescript
// In dashboard page
import { getDotProfile } from '@/lib/fmcsa/provider';
import { getLatestRiskSnapshot } from '@/lib/risk/engine';

const profile = await getDotProfile('123456');
const risk = await getLatestRiskSnapshot('123456');

// Display FMCSA data
<div>
  <Label>FMCSA Safety Rating</Label>
  <Badge>{profile.fmcsa_safety_rating || 'Not Rated'}</Badge>
  <p className="text-xs">Based on FMCSA data as of {profile.safety_rating_date}</p>
</div>

// Display our risk assessment (separate)
<div>
  <Label>Risk Level</Label>
  <Badge>{risk.risk_level}</Badge>
  <p className="text-xs">Our assessment based on public inspection patterns</p>
</div>
```

---

## Next Steps

1. **Run migration**: Apply `20260120_phase2_fmcsa.sql` to Supabase
2. **Add FMCSA_WEBKEY**: Configure environment variable
3. **Test provider**: Fetch sample DOT numbers
4. **Test risk engine**: Calculate risk scores
5. **Update dashboard**: Replace mock data with real data

---

## Language Compliance

### ✅ Approved Usage:

- "FMCSA safety rating" (not "official")
- "Based on FMCSA data"
- "Public inspection patterns"
- "Ongoing monitoring"
- "Data refreshed every 12 hours"

### ❌ Prohibited Usage:

- "Official safety rating"
- "Real-time monitoring"
- "Immediate alerts"
- "Critical violations"
- "Predict enforcement"

---

**Implementation Status**: Complete and ready for testing
**Schema Alignment**: ✅ Conforms to existing table structure
**Provider Separation**: ✅ FMCSA data fetching separate from risk scoring
**Language Compliance**: ✅ No prohibited terms used
