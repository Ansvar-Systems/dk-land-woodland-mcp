export interface Meta {
  disclaimer: string;
  data_age: string;
  source_url: string;
  copyright: string;
  server: string;
  version: string;
}

const DISCLAIMER =
  'Data er vejledende. Kontakt din kommune for konkrete arealbeskyttelser. ' +
  '§3-registreringen kan ses paa miljoeportalen.dk. Regler varierer efter ' +
  'kommuneplan, lokalplan og specifikke udpegninger (Natura 2000, fredskov, §3-areal).';

export function buildMeta(overrides?: Partial<Meta>): Meta {
  return {
    disclaimer: DISCLAIMER,
    data_age: overrides?.data_age ?? 'unknown',
    source_url: overrides?.source_url ?? 'https://www.retsinformation.dk',
    copyright: 'Data: Naturstyrelsen, Miljoestyrelsen, Landbrugsstyrelsen. Server: Apache-2.0 Ansvar Systems.',
    server: 'Danish Land and Woodland MCP',
    version: '0.1.0',
    ...overrides,
  };
}
