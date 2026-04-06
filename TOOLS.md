# Tools Reference

## Meta Tools

### `about`

Get server metadata: name, version, coverage, data sources, and links.

**Parameters:** None

**Returns:** Server name, version, jurisdiction list, data source names, tool count, homepage/repository links.

---

### `list_sources`

List all data sources with authority, URL, license, and freshness info.

**Parameters:** None

**Returns:** Array of data sources, each with `name`, `authority`, `official_url`, `retrieval_method`, `update_frequency`, `license`, `coverage`, `last_retrieved`.

---

### `check_data_freshness`

Check when data was last ingested, staleness status, and how to trigger a refresh.

**Parameters:** None

**Returns:** `status` (fresh/stale/unknown), `last_ingest`, `days_since_ingest`, `staleness_threshold_days`, `refresh_command`.

---

## Domain Tools

### `search_land_rules`

Full-text search across all Danish land and woodland management rules. Use for broad queries about hegn, fredskov, §3-natur, adgangsret, overdrev, or skovrejsning.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Free-text search query (Danish or English) |
| `topic` | string | No | Filter by topic (hedgerow, felling, sssi, rights_of_way, common_land, planting) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: DK) |
| `limit` | number | No | Max results (default: 20, max: 50) |

**Example:** `{ "query": "fredskov fældning" }`

---

### `check_hedgerow_rules`

Check Danish hegn regulations by action type. Returns hegnspligt requirements, §3-beskyttelse, randzoner, skovbyggelinje, and hegnssyn rules under Hegnsloven and Naturbeskyttelsesloven.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | Action type (e.g. fjernelse, klipning, hegning, randzone, hegnssyn) |
| `hedgerow_type` | string | No | Hegn type (e.g. levende hegn, §3-areal, strandbeskyttelseslinje) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: DK) |

**Returns:** Notice requirement (boolean), exemptions, §3-criteria, penalties, regulation reference.

**Example:** `{ "action": "fjernelse" }`

---

### `get_felling_licence_rules`

Get Danish skovlov felling rules by scenario. Returns whether felling requires permission, exemptions, application process, and penalties under Skovloven.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `volume_m3` | number | No | Volume of timber to fell in cubic metres |
| `area_ha` | number | No | Area of woodland in hectares |
| `reason` | string | No | Reason for felling (e.g. nødstildet, rydning, skovrejsning) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: DK) |

**Returns:** Licence assessment (if volume provided), matching rules with licence requirement, thresholds, exemptions, application process, penalties.

**Example:** `{ "reason": "nødstildet" }` — returns rules for emergency felling of dangerous trees

---

### `check_sssi_consent`

Check whether an activity on a §3-beskyttet naturtype requires dispensation from the kommune. Returns process, typical conditions, and penalties under Naturbeskyttelsesloven §3.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `activity` | string | Yes | Proposed activity (e.g. dræning, dyrkning, gødskning, pesticider, anlæg, afbrænding) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: DK) |

**Returns:** Consent required (boolean), process (how to apply), typical conditions, penalties.

**Example:** `{ "activity": "dræning" }`

---

### `get_rights_of_way_rules`

Get Danish adgangsret (right of access) rules by type and issue. Returns access rights for private skove, strandbredder, overdrev, offentlige stier, ridning, and hunde båndpligt.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path_type` | string | No | Access type (skov, strand, overdrev, sti, ridning, hund) |
| `issue` | string | No | Issue type (e.g. adgang, hund, camping, cykling, ridning) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: DK) |

**Returns:** Access type, obligation, minimum width (metres), conditions, reinstatement requirements, obstruction liability.

**Example:** `{ "path_type": "skov" }` — returns public access rights for private woodlands

---

### `get_common_land_rules`

Get Danish rules for overdrev and fællesarealer. Returns §3 protection rules, consent requirements, and responsible authority under Naturbeskyttelsesloven.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `activity` | string | No | Proposed activity (e.g. dyrkning, hegning, afgræsning, adgang) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: DK) |

**Returns:** Activity, consent required (boolean), consent authority, process.

**Example:** `{ "activity": "afgræsning" }`

---

### `get_planting_guidance`

Get Danish skovrejsning guidance including tilskud (grants), VVM-screening thresholds, and species recommendations under Skovloven and Skovtilskudsordningen.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tree_type` | string | No | Species group (e.g. løvskov, nåleskov, blandet, brede/elle) |
| `purpose` | string | No | Planting purpose (e.g. skovrejsning, vandløb, agroforstbrug) |
| `area_ha` | number | No | Planned planting area in hectares (VVM-screening required if >20ha) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: DK) |

**Returns:** Purpose, species group, minimum area, VVM screening required, grant available (with rates), buffer requirements.

**Example:** `{ "tree_type": "løvskov", "purpose": "skovrejsning", "area_ha": 5 }`

---

### `get_tpo_rules`

Get Danish rules for fredede træer, skovbyggelinjen, and fortidsmindebeskyttelseslinjen. Returns dispensation requirements, exemptions, process, and penalties.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scenario` | string | No | Scenario (e.g. fredet træ, skovbyggelinje, fortidsminde, jordarbejde) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: DK) |

**Returns:** Scenario, consent required (boolean), consent authority, exemptions, process, penalties, regulation reference.

**Example:** `{ "scenario": "skovbyggelinje" }`
