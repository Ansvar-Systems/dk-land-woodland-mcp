import { buildMeta } from '../metadata.js';
import type { Database } from '../db.js';

interface Source {
  name: string;
  authority: string;
  official_url: string;
  retrieval_method: string;
  update_frequency: string;
  license: string;
  coverage: string;
  last_retrieved?: string;
}

export function handleListSources(db: Database): { sources: Source[]; _meta: ReturnType<typeof buildMeta> } {
  const lastIngest = db.get<{ value: string }>('SELECT value FROM db_metadata WHERE key = ?', ['last_ingest']);

  const sources: Source[] = [
    {
      name: 'Skovloven (LBK nr 315 af 28/03/2019)',
      authority: 'Naturstyrelsen / Miljøministeriet',
      official_url: 'https://www.retsinformation.dk/eli/lta/2019/315',
      retrieval_method: 'MANUAL_REVIEW',
      update_frequency: 'as_amended',
      license: 'Åbne Offentlige Data',
      coverage: 'Fredskov, fældetilladelse, skovdyrkningspligt, skovbyggelinje, skovrejsning',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Naturbeskyttelsesloven (LBK nr 1392 af 04/10/2022)',
      authority: 'Miljøstyrelsen / Miljøministeriet',
      official_url: 'https://www.retsinformation.dk/eli/lta/2022/1392',
      retrieval_method: 'MANUAL_REVIEW',
      update_frequency: 'as_amended',
      license: 'Åbne Offentlige Data',
      coverage: '§3 beskyttede naturtyper, adgangsret, sø- og åbeskyttelseslinje, fortidsmindebeskyttelse, klitfredning',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Lov om hegn (LBK nr 851 af 17/08/2011)',
      authority: 'Plan- og Landdistriktsstyrelsen / Indenrigs- og Boligministeriet',
      official_url: 'https://www.retsinformation.dk/eli/lta/2011/851',
      retrieval_method: 'MANUAL_REVIEW',
      update_frequency: 'as_amended',
      license: 'Åbne Offentlige Data',
      coverage: 'Hegnspligt, levende hegn, skelforhold, hegnssyn',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Miljøbeskyttelsesloven (LBK nr 100 af 19/01/2022)',
      authority: 'Miljøstyrelsen',
      official_url: 'https://www.retsinformation.dk/eli/lta/2022/100',
      retrieval_method: 'MANUAL_REVIEW',
      update_frequency: 'as_amended',
      license: 'Åbne Offentlige Data',
      coverage: 'Miljøbeskyttelse, gødningsregler, pesticider, vandmiljø',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Landbrugsstyrelsens vejledninger om gødning og sprøjtemidler',
      authority: 'Landbrugsstyrelsen',
      official_url: 'https://lbst.dk/landbrug/regler-for-landbrug/',
      retrieval_method: 'MANUAL_REVIEW',
      update_frequency: 'annual',
      license: 'Åbne Offentlige Data',
      coverage: 'Gødningsnormer, sprøjtemiddelbegrænsninger, randzoner, jordbehandling',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Kystdirektoratets regler om strandbeskyttelseslinjen',
      authority: 'Kystdirektoratet',
      official_url: 'https://kyst.dk/kystbeskyttelse/strandbeskyttelseslinjen/',
      retrieval_method: 'MANUAL_REVIEW',
      update_frequency: 'as_amended',
      license: 'Åbne Offentlige Data',
      coverage: 'Strandbeskyttelseslinje (300m), dispensation, bygge- og anlægsforhold ved kysten',
      last_retrieved: lastIngest?.value,
    },
  ];

  return {
    sources,
    _meta: buildMeta({ source_url: 'https://www.retsinformation.dk' }),
  };
}
