/**
 * Denmark Land & Woodland MCP — Data Ingestion Script
 *
 * Populates the SQLite database with Danish land and woodland regulation data.
 * Sources: Naturstyrelsen, Miljostyrelsen, Landbrugsstyrelsen, Plan- og Landdistriktsstyrelsen.
 *
 * Usage: npm run ingest
 */

import { createDatabase } from '../src/db.js';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('data', { recursive: true });
const db = createDatabase('data/database.db');

const now = new Date().toISOString().split('T')[0];

// ---------------------------------------------------------------------------
// Clear existing data
// ---------------------------------------------------------------------------
const tables = [
  'hedgerow_rules',
  'felling_rules',
  'sssi_operations',
  'rights_of_way',
  'common_land_rules',
  'planting_guidance',
  'tpo_rules',
  'search_index',
];
for (const t of tables) {
  db.run(`DELETE FROM ${t}`);
}

// ---------------------------------------------------------------------------
// 1. Protected Habitats — mapped to hedgerow_rules
//    (hedgerow_rules is the closest structural match for habitat protections)
// ---------------------------------------------------------------------------

const protectedHabitats = [
  {
    action: 'Hede (§3-areal)',
    notice_required: 1,
    exemptions: 'Kommunen kan dispensere i saerlige tilfaelde.',
    important_hedgerow_criteria:
      'Minimumsareal 2.500 m2. Lyngklaedte arealer med karakteristisk hedevegetation. Beskyttet mod tilstandsaendring.',
    penalties:
      'Politianmeldelse og paabud om reetablering. Bodsstraf efter naturbeskyttelsesloven.',
    regulation_ref: 'Naturbeskyttelsesloven §3',
    jurisdiction: 'DK',
  },
  {
    action: 'Mose (§3-areal)',
    notice_required: 1,
    exemptions: 'Kommunen kan dispensere i saerlige tilfaelde.',
    important_hedgerow_criteria:
      'Minimumsareal 2.500 m2. Vadomrader med torvejord. Omfatter hojmoser, kaermoser og rigkaer.',
    penalties:
      'Politianmeldelse og paabud om reetablering. Bodsstraf efter naturbeskyttelsesloven.',
    regulation_ref: 'Naturbeskyttelsesloven §3',
    jurisdiction: 'DK',
  },
  {
    action: 'Fersk eng (§3-areal)',
    notice_required: 1,
    exemptions: 'Kommunen kan dispensere i saerlige tilfaelde.',
    important_hedgerow_criteria:
      'Minimumsareal 2.500 m2. Lavtliggende enge med grundvandspaavirket vegetation.',
    penalties:
      'Politianmeldelse og paabud om reetablering. Bodsstraf efter naturbeskyttelsesloven.',
    regulation_ref: 'Naturbeskyttelsesloven §3',
    jurisdiction: 'DK',
  },
  {
    action: 'Strandeng (§3-areal)',
    notice_required: 1,
    exemptions: 'Kommunen kan dispensere i saerlige tilfaelde.',
    important_hedgerow_criteria:
      'Minimumsareal 2.500 m2. Enge langs kysten med saltpaavirket vegetation.',
    penalties:
      'Politianmeldelse og paabud om reetablering. Bodsstraf efter naturbeskyttelsesloven.',
    regulation_ref: 'Naturbeskyttelsesloven §3',
    jurisdiction: 'DK',
  },
  {
    action: 'Overdrev (§3-areal)',
    notice_required: 1,
    exemptions: 'Kommunen kan dispensere i saerlige tilfaelde.',
    important_hedgerow_criteria:
      'Minimumsareal 2.500 m2. Torre, naeringsfattige graesarealer med artsrig vegetation.',
    penalties:
      'Politianmeldelse og paabud om reetablering. Bodsstraf efter naturbeskyttelsesloven.',
    regulation_ref: 'Naturbeskyttelsesloven §3',
    jurisdiction: 'DK',
  },
  {
    action: 'So (§3-areal)',
    notice_required: 1,
    exemptions: 'Kommunen kan dispensere i saerlige tilfaelde.',
    important_hedgerow_criteria:
      'Minimumsareal 100 m2. Naturlige og menneskeskabte soer over 100 m2.',
    penalties:
      'Politianmeldelse og paabud om reetablering. Bodsstraf efter naturbeskyttelsesloven.',
    regulation_ref: 'Naturbeskyttelsesloven §3',
    jurisdiction: 'DK',
  },
  {
    action: 'Vandlob (§3-areal)',
    notice_required: 1,
    exemptions: 'Kommunen kan dispensere i saerlige tilfaelde.',
    important_hedgerow_criteria:
      'Naturlige og regulerede vandlob. Beskyttet mod rorlaegning og regulering.',
    penalties:
      'Politianmeldelse og paabud om reetablering. Bodsstraf efter naturbeskyttelsesloven.',
    regulation_ref: 'Naturbeskyttelsesloven §3',
    jurisdiction: 'DK',
  },
];

const insertHedgerow = db.instance.prepare(`
  INSERT INTO hedgerow_rules
    (action, notice_required, exemptions, important_hedgerow_criteria, penalties, regulation_ref, jurisdiction)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const h of protectedHabitats) {
  insertHedgerow.run(
    h.action,
    h.notice_required,
    h.exemptions,
    h.important_hedgerow_criteria,
    h.penalties,
    h.regulation_ref,
    h.jurisdiction
  );
}

console.log(`Inserted ${protectedHabitats.length} protected habitat records.`);

// ---------------------------------------------------------------------------
// 2. Forest Rules (Fredskov) — mapped to felling_rules
// ---------------------------------------------------------------------------

const forestRules = [
  {
    scenario: 'Fredskovspligt',
    licence_required: 1,
    threshold_m3: null,
    threshold_ha: null,
    exemptions: null,
    application_process:
      'Al skov aeldre end 50 aar er fredskovspligtig. Nye skove med offentligt tilskud faar fredskovspligt.',
    penalties:
      'Genplantningspligt inden 10 aar efter faeldning. Forbud mod byggeri og aendret arealanvendelse.',
    regulation_ref: 'Skovloven',
    jurisdiction: 'DK',
  },
  {
    scenario: 'Driftsplanpligt',
    licence_required: 1,
    threshold_m3: null,
    threshold_ha: 50,
    exemptions: 'Skovejere med fredskov under 50 ha er undtaget.',
    application_process:
      'Obligatorisk for skovejere med fredskov over 50 ha. Planen gaelder 10-15 aar. Indhold: hugstplan, foryngelsesplan, naturhensyn, beskyttelse af fortidsminder.',
    penalties: 'Paabud fra Naturstyrelsen om udarbejdelse af driftsplan.',
    regulation_ref: 'Skovloven §17',
    jurisdiction: 'DK',
  },
  {
    scenario: 'Skovrejsning',
    licence_required: 0,
    threshold_m3: null,
    threshold_ha: null,
    exemptions: null,
    application_process:
      'Kommuneplanen udpeger skovrejsningsomraader (onsket, uonsket, neutralt). Tilskud via Landbrugsstyrelsen. Min. 75% lovtrae ved tilskudsfinansieret skovrejsning.',
    penalties: null,
    regulation_ref: 'Skovloven; Planloven',
    jurisdiction: 'DK',
  },
  {
    scenario: 'Hugst i fredskov',
    licence_required: 1,
    threshold_m3: null,
    threshold_ha: 0.5,
    exemptions:
      'Mindre hugst under 0.5 ha kræver ikke anmeldelse. Stormfald og sanitaerhugst er undtaget.',
    application_process:
      'Hugst i fredskov kraever anmeldelse til Naturstyrelsen ved storre arealer (over 0.5 ha). Genplantning eller naturlig foryngelse inden 10 aar.',
    penalties:
      'Paabud om genplantning. Bod og politianmeldelse ved ulovlig hugst.',
    regulation_ref: 'Skovloven §8-9',
    jurisdiction: 'DK',
  },
];

const insertFelling = db.instance.prepare(`
  INSERT INTO felling_rules
    (scenario, licence_required, threshold_m3, threshold_ha, exemptions, application_process, penalties, regulation_ref, jurisdiction)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const f of forestRules) {
  insertFelling.run(
    f.scenario,
    f.licence_required,
    f.threshold_m3,
    f.threshold_ha,
    f.exemptions,
    f.application_process,
    f.penalties,
    f.regulation_ref,
    f.jurisdiction
  );
}

console.log(`Inserted ${forestRules.length} forest rule records.`);

// ---------------------------------------------------------------------------
// 3. Nature Conservation — mapped to sssi_operations
//    (SSSI is the closest structural match for Natura 2000 / conservation zones)
// ---------------------------------------------------------------------------

const natureConservation = [
  {
    operation: 'Natura 2000-omraader',
    consent_required: 1,
    process:
      '257 Natura 2000-omraader i Danmark. Konsekvensvurdering obligatorisk for projekter der kan paavirke omraaderne. Ansoegning til kommunen eller Miljoestyrelsen.',
    typical_conditions:
      'Habitatdirektivet og fuglebeskyttelsesdirektivet. Afboedende foranstaltninger kan kraeves. Forbud mod forringelse af udpegningsgrundlaget.',
    penalties:
      'Standsningspaabud, politianmeldelse, erstatningsansvar for skadet natur.',
    jurisdiction: 'DK',
  },
  {
    operation: 'Strandbeskyttelseslinje (300 m)',
    consent_required: 1,
    process:
      '300-meter strandbeskyttelseslinje fra kysten (100 m i sommerhusomraader). Dispensation soeges hos Kystdirektoratet.',
    typical_conditions:
      'Forbud mod byggeri, terraenaendring, tilplantning inden for linjen.',
    penalties:
      'Paabud om fjernelse, politianmeldelse, lovliggoerelse paa ejerens regning.',
    jurisdiction: 'DK',
  },
  {
    operation: 'So- og aa-beskyttelseslinje (150 m)',
    consent_required: 1,
    process:
      '150-meter beskyttelseslinje omkring soer over 3 ha og vandloeb. Dispensation soeges hos kommunen.',
    typical_conditions:
      'Forbud mod placering af bebyggelse, campingvogne og lignende inden for 150 m.',
    penalties:
      'Paabud om fjernelse, lovliggoerelse paa ejerens regning.',
    jurisdiction: 'DK',
  },
  {
    operation: 'Fortidsmindebeskyttelseslinje (100 m)',
    consent_required: 1,
    process:
      '100-meter beskyttelseszone om synlige fortidsminder. Dispensation soeges hos Slots- og Kulturstyrelsen.',
    typical_conditions:
      'Forbud mod jordbearbejdning og byggeri inden for 100 m af synlige fortidsminder.',
    penalties:
      'Paabud, politianmeldelse og erstatningskrav fra Slots- og Kulturstyrelsen.',
    jurisdiction: 'DK',
  },
];

const insertSSSI = db.instance.prepare(`
  INSERT INTO sssi_operations
    (operation, consent_required, process, typical_conditions, penalties, jurisdiction)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const s of natureConservation) {
  insertSSSI.run(
    s.operation,
    s.consent_required,
    s.process,
    s.typical_conditions,
    s.penalties,
    s.jurisdiction
  );
}

console.log(`Inserted ${natureConservation.length} nature conservation records.`);

// ---------------------------------------------------------------------------
// 4. Farmland Obligations — mapped to rights_of_way
//    (rights_of_way is repurposed for farmland obligations in the DK context)
// ---------------------------------------------------------------------------

const farmlandObligations = [
  {
    path_type: 'Landbrugspligt',
    obligation:
      'Selvstaendig landbrugsejendom over 30 ha har bopælspligt og uddannelseskrav (gront bevis eller tilsvarende).',
    min_width_m: 30,
    cropping_rules:
      'Bopælspligt — ejer eller forpagter skal bo paa ejendommen.',
    reinstatement_deadline: 'Inden 6 maaneder efter erhvervelse.',
    obstruction_liability:
      'Boede og tvangssalg ved manglende opfyldelse af bopælspligt.',
    jurisdiction: 'DK',
  },
  {
    path_type: 'Jordbearbejdningskrav',
    obligation:
      'Landbrugsjorder skal enten dyrkes, afgraesses eller plejes. Arealer maa ikke ligge ubenyttet hen.',
    min_width_m: null,
    cropping_rules:
      'Minimum hvert 5. aar skal jorden bearbejdes, afgraesses eller slaas.',
    reinstatement_deadline: '5 aar.',
    obstruction_liability:
      'Paabud fra Landbrugsstyrelsen om drift af jorden.',
    jurisdiction: 'DK',
  },
  {
    path_type: 'Sammenlaegning',
    obligation:
      'Sammenlaegning af landbrugsejendomme kraever tilladelse fra Jordbrugskommissionen ved arealer over 500 ha.',
    min_width_m: 500,
    cropping_rules: null,
    reinstatement_deadline: null,
    obstruction_liability:
      'Afslag paa sammenlaegning og paabud om frasalg.',
    jurisdiction: 'DK',
  },
  {
    path_type: 'Udstykning',
    obligation:
      'Udstykning af landbrugsjorder kraever tilladelse. Minimumsstoerrelse 2 ha for nye landbrugsejendomme.',
    min_width_m: 2,
    cropping_rules: null,
    reinstatement_deadline: null,
    obstruction_liability:
      'Afslag og paabud om sammenforing af udstykket jord.',
    jurisdiction: 'DK',
  },
];

const insertROW = db.instance.prepare(`
  INSERT INTO rights_of_way
    (path_type, obligation, min_width_m, cropping_rules, reinstatement_deadline, obstruction_liability, jurisdiction)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const r of farmlandObligations) {
  insertROW.run(
    r.path_type,
    r.obligation,
    r.min_width_m,
    r.cropping_rules,
    r.reinstatement_deadline,
    r.obstruction_liability,
    r.jurisdiction
  );
}

console.log(`Inserted ${farmlandObligations.length} farmland obligation records.`);

// ---------------------------------------------------------------------------
// 5. Land Consolidation — mapped to common_land_rules
// ---------------------------------------------------------------------------

const landConsolidation = [
  {
    activity: 'Frivillig jordfordeling',
    consent_required: 0,
    consent_authority: 'Jordfordelingskommissionen',
    process:
      'Frivillig jordfordeling for strukturtilpasning. Faciliteres af Jordfordelingskommissionen. Jordbytte mellem naboer. Kan kombineres med tilskudsordninger.',
    jurisdiction: 'DK',
  },
  {
    activity: 'Offentlig jordfordeling',
    consent_required: 1,
    consent_authority: 'Staten (Miljoestyrelsen / Landbrugsstyrelsen)',
    process:
      'Offentlig jordfordeling for naturgenopretning, klimaprojekter eller infrastruktur. Staten kan ekspropriere mod fuldstaendig erstatning. Kræver offentlig hoering.',
    jurisdiction: 'DK',
  },
];

const insertCommon = db.instance.prepare(`
  INSERT INTO common_land_rules
    (activity, consent_required, consent_authority, process, jurisdiction)
  VALUES (?, ?, ?, ?, ?)
`);

for (const c of landConsolidation) {
  insertCommon.run(
    c.activity,
    c.consent_required,
    c.consent_authority,
    c.process,
    c.jurisdiction
  );
}

console.log(`Inserted ${landConsolidation.length} land consolidation records.`);

// ---------------------------------------------------------------------------
// 6. Planting Guidance (skovrejsning)
// ---------------------------------------------------------------------------

const plantingGuidance = [
  {
    purpose: 'Skovrejsning med tilskud',
    species_group: 'Lovtraer (eg, bog, ask, ahorn)',
    min_area_ha: 2,
    eia_screening_required: 1,
    grant_available:
      'Landbrugsstyrelsen yder tilskud til skovrejsning. Grundbetaling kan opretholdes i en overgangsperiode.',
    ancient_woodland_buffer_m: 0,
    jurisdiction: 'DK',
  },
  {
    purpose: 'Skovrejsning uden tilskud',
    species_group: 'Blandet (lov- og naaletrae)',
    min_area_ha: 0.5,
    eia_screening_required: 0,
    grant_available: null,
    ancient_woodland_buffer_m: 0,
    jurisdiction: 'DK',
  },
  {
    purpose: 'Lae- og energiplantninger',
    species_group: 'Pil, poppel, el',
    min_area_ha: 0.3,
    eia_screening_required: 0,
    grant_available:
      'Tilskud til laeplantning via Laeplantningsordningen.',
    ancient_woodland_buffer_m: 0,
    jurisdiction: 'DK',
  },
  {
    purpose: 'Naturgenopretning med skov',
    species_group: 'Hjemmehørende arter (eg, birk, ronn)',
    min_area_ha: 1,
    eia_screening_required: 1,
    grant_available:
      'Tilskud via Miljoestyrelsen til skov paa kulstofrige lavbundsjorder.',
    ancient_woodland_buffer_m: 0,
    jurisdiction: 'DK',
  },
  {
    purpose: 'Fredskovspligtig skovrejsning',
    species_group: 'Min. 75% lovtrae',
    min_area_ha: 2,
    eia_screening_required: 1,
    grant_available:
      'Offentligt tilskud medfoerer automatisk fredskovspligt. Genplantningspligt gaaelder permanent.',
    ancient_woodland_buffer_m: 0,
    jurisdiction: 'DK',
  },
];

const insertPlanting = db.instance.prepare(`
  INSERT INTO planting_guidance
    (purpose, species_group, min_area_ha, eia_screening_required, grant_available, ancient_woodland_buffer_m, jurisdiction)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const p of plantingGuidance) {
  insertPlanting.run(
    p.purpose,
    p.species_group,
    p.min_area_ha,
    p.eia_screening_required,
    p.grant_available,
    p.ancient_woodland_buffer_m,
    p.jurisdiction
  );
}

console.log(`Inserted ${plantingGuidance.length} planting guidance records.`);

// ---------------------------------------------------------------------------
// 7. Tree Protection (fredede traeer) — mapped to tpo_rules
// ---------------------------------------------------------------------------

const treeProtection = [
  {
    scenario: 'Fredskov — faeldning af enkelttrae',
    consent_required: 0,
    consent_authority: null,
    exemptions: 'Normal skovdrift (tynding, plukhugsst). Stormfald og sikkerhedsrisiko.',
    process: 'Ingen anmeldelse kræves for enkelttrae i normal skovdrift.',
    penalties: null,
    regulation_ref: 'Skovloven §8',
    jurisdiction: 'DK',
  },
  {
    scenario: 'Fredskov — renafdrift over 0.5 ha',
    consent_required: 1,
    consent_authority: 'Naturstyrelsen',
    exemptions: 'Stormfald og sanitaerhugst.',
    process:
      'Anmeldelse til Naturstyrelsen mindst 4 uger for planlagt renafdrift over 0.5 ha. Genplantningsplan skal medfolge.',
    penalties:
      'Paabud om genplantning inden 10 aar. Bod ved manglende genplantning.',
    regulation_ref: 'Skovloven §8-9',
    jurisdiction: 'DK',
  },
  {
    scenario: 'Bevaringsvaerdige traeer i byzone',
    consent_required: 1,
    consent_authority: 'Kommunen',
    exemptions: 'Akut fare for personskade.',
    process:
      'Kommunen kan i lokalplan bestemme bevaring af konkrete traeer. Faeldning kraever dispensation.',
    penalties:
      'Paabud om genplantning, erstatning, politianmeldelse.',
    regulation_ref: 'Planloven §15, stk. 2, nr. 10',
    jurisdiction: 'DK',
  },
  {
    scenario: 'Naturskov og urort skov',
    consent_required: 1,
    consent_authority: 'Naturstyrelsen',
    exemptions: null,
    process:
      'Naturskov og urort skov i statsskovene er friholdt for hugst. Private skove kan udlaegs som urort skov med tilskud.',
    penalties:
      'Paabud om reetablering og tilbagebetaling af tilskud.',
    regulation_ref: 'Skovloven §25; Naturbeskyttelsesloven §3',
    jurisdiction: 'DK',
  },
];

const insertTPO = db.instance.prepare(`
  INSERT INTO tpo_rules
    (scenario, consent_required, consent_authority, exemptions, process, penalties, regulation_ref, jurisdiction)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const t of treeProtection) {
  insertTPO.run(
    t.scenario,
    t.consent_required,
    t.consent_authority,
    t.exemptions,
    t.process,
    t.penalties,
    t.regulation_ref,
    t.jurisdiction
  );
}

console.log(`Inserted ${treeProtection.length} tree protection records.`);

// ---------------------------------------------------------------------------
// 8. Build FTS5 search index
// ---------------------------------------------------------------------------

const insertFTS = db.instance.prepare(`
  INSERT INTO search_index (title, body, topic, jurisdiction)
  VALUES (?, ?, ?, ?)
`);

// Protected habitats
for (const h of protectedHabitats) {
  insertFTS.run(
    h.action,
    `${h.important_hedgerow_criteria} ${h.exemptions} ${h.penalties}`,
    'Beskyttede naturtyper (§3-arealer)',
    'DK'
  );
}

// Forest rules
for (const f of forestRules) {
  insertFTS.run(
    f.scenario,
    `${f.application_process} ${f.exemptions ?? ''} ${f.penalties ?? ''}`,
    'Skovregler (fredskov)',
    'DK'
  );
}

// Nature conservation
for (const s of natureConservation) {
  insertFTS.run(
    s.operation,
    `${s.process} ${s.typical_conditions} ${s.penalties}`,
    'Naturbeskyttelse',
    'DK'
  );
}

// Farmland obligations
for (const r of farmlandObligations) {
  insertFTS.run(
    r.path_type,
    `${r.obligation} ${r.cropping_rules ?? ''} ${r.obstruction_liability}`,
    'Landbrugspligt',
    'DK'
  );
}

// Land consolidation
for (const c of landConsolidation) {
  insertFTS.run(
    c.activity,
    c.process,
    'Jordfordeling',
    'DK'
  );
}

// Planting guidance
for (const p of plantingGuidance) {
  insertFTS.run(
    `${p.purpose} — ${p.species_group}`,
    `${p.grant_available ?? ''} Min. areal: ${p.min_area_ha} ha. VVM-screening: ${p.eia_screening_required ? 'ja' : 'nej'}.`,
    'Skovrejsning og plantning',
    'DK'
  );
}

// Tree protection
for (const t of treeProtection) {
  insertFTS.run(
    t.scenario,
    `${t.process} ${t.exemptions ?? ''} ${t.penalties ?? ''}`,
    'Traebeskyttelse',
    'DK'
  );
}

const totalFTS =
  protectedHabitats.length +
  forestRules.length +
  natureConservation.length +
  farmlandObligations.length +
  landConsolidation.length +
  plantingGuidance.length +
  treeProtection.length;

console.log(`Inserted ${totalFTS} FTS search index entries.`);

// ---------------------------------------------------------------------------
// 9. Update db_metadata
// ---------------------------------------------------------------------------

db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('mcp_name', 'Danish Land and Woodland MCP')");
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('jurisdiction', 'DK')");
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('schema_version', '1.0')");
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('last_ingest', ?)", [now]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('build_date', ?)", [now]);
db.run(
  "INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('data_sources', ?)",
  ['Naturstyrelsen, Miljoestyrelsen, Landbrugsstyrelsen, Plan- og Landdistriktsstyrelsen']
);
db.run(
  "INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('disclaimer', ?)",
  ['Data er vejledende. Kontakt din kommune for konkrete arealbeskyttelser. §3-registreringen kan ses paa miljoeportalen.dk.']
);

// ---------------------------------------------------------------------------
// 10. Write coverage.json
// ---------------------------------------------------------------------------

writeFileSync(
  'data/coverage.json',
  JSON.stringify(
    {
      mcp_name: 'Danish Land and Woodland MCP',
      jurisdiction: 'DK',
      build_date: now,
      status: 'populated',
      record_counts: {
        protected_habitats: protectedHabitats.length,
        forest_rules: forestRules.length,
        nature_conservation: natureConservation.length,
        farmland_obligations: farmlandObligations.length,
        land_consolidation: landConsolidation.length,
        planting_guidance: plantingGuidance.length,
        tree_protection: treeProtection.length,
        fts_entries: totalFTS,
      },
      data_sources: [
        'Naturstyrelsen',
        'Miljoestyrelsen',
        'Landbrugsstyrelsen',
        'Plan- og Landdistriktsstyrelsen',
      ],
      disclaimer:
        'Data er vejledende. Kontakt din kommune for konkrete arealbeskyttelser. §3-registreringen kan ses paa miljoeportalen.dk.',
    },
    null,
    2
  )
);

db.close();
console.log('Danish land and woodland data ingested successfully.');
console.log(`Database: data/database.db | Coverage: data/coverage.json`);
