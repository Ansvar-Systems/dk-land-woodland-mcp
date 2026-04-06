import { buildMeta } from '../metadata.js';
import { SUPPORTED_JURISDICTIONS } from '../jurisdiction.js';

export function handleAbout() {
  return {
    name: 'Danish Land & Woodland Management MCP',
    description:
      'Danish land and woodland management regulations via MCP. Covers hegn regulations, ' +
      'skovlov felling rules, §3 nature protection, adgangsret (rights of access), ' +
      'overdrev and fællesarealer, and skovrejsning (woodland planting) guidance. ' +
      'Based on published Danish legislation from retsinformation.dk.',
    version: '0.1.0',
    jurisdiction: [...SUPPORTED_JURISDICTIONS],
    data_sources: [
      'Naturstyrelsen (Danish Nature Agency)',
      'Miljøstyrelsen (Danish Environmental Protection Agency)',
      'Landbrugsstyrelsen (Danish Agricultural Agency)',
      'Plan- og Landdistriktsstyrelsen (Danish Planning Agency)',
      'Kystdirektoratet (Danish Coastal Authority)',
      'retsinformation.dk (Skovloven, Naturbeskyttelsesloven, Hegnsloven)',
    ],
    tools_count: 11,
    links: {
      homepage: 'https://ansvar.eu/open-agriculture',
      repository: 'https://github.com/Ansvar-Systems/dk-land-woodland-mcp',
      mcp_network: 'https://ansvar.ai/mcp',
    },
    _meta: buildMeta(),
  };
}
