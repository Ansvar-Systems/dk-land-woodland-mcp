import { buildMeta } from '../metadata.js';
import { validateJurisdiction } from '../jurisdiction.js';
import type { Database } from '../db.js';

interface FellingArgs {
  volume_m3?: number;
  area_ha?: number;
  reason?: string;
  jurisdiction?: string;
}

export function handleGetFellingLicenceRules(db: Database, args: FellingArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  let sql = 'SELECT * FROM felling_rules WHERE jurisdiction = ?';
  const params: unknown[] = [jv.jurisdiction];

  if (args.reason) {
    sql += ' AND LOWER(scenario) LIKE LOWER(?)';
    params.push(`%${args.reason}%`);
  }

  sql += ' ORDER BY id';

  const rules = db.all<{
    id: number;
    scenario: string;
    licence_required: number;
    threshold_m3: number | null;
    threshold_ha: number | null;
    exemptions: string;
    application_process: string;
    penalties: string;
    regulation_ref: string;
    jurisdiction: string;
  }>(sql, params);

  // If volume provided, provide context (Danish rules do not have a simple volume threshold like UK)
  let licence_assessment: string | null = null;
  if (args.volume_m3 !== undefined) {
    licence_assessment = `${args.volume_m3} m3: I Danmark gælder ingen simpel volumentærskel. Tilladelse til fældning afhænger af, om træet er i fredskov (Skovloven §8). Tjek om arealet er registreret fredskov. Fældning af enkelttstående træer uden for fredskov kræver normalt ikke tilladelse.`;
  }

  return {
    query: {
      volume_m3: args.volume_m3 ?? null,
      area_ha: args.area_ha ?? null,
      reason: args.reason ?? null,
    },
    jurisdiction: jv.jurisdiction,
    licence_assessment,
    results_count: rules.length,
    results: rules.map(r => ({
      scenario: r.scenario,
      licence_required: r.licence_required === 1,
      threshold_m3: r.threshold_m3,
      threshold_ha: r.threshold_ha,
      exemptions: r.exemptions,
      application_process: r.application_process,
      penalties: r.penalties,
      regulation_ref: r.regulation_ref,
    })),
    _meta: buildMeta({ source_url: 'https://www.retsinformation.dk/eli/lta/2019/315' }),
  };
}
