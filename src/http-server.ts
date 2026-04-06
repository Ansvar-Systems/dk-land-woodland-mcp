import { createServer, type IncomingMessage, type ServerResponse } from 'http';
import { randomUUID } from 'crypto';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { createDatabase, type Database } from './db.js';
import { handleAbout } from './tools/about.js';
import { handleListSources } from './tools/list-sources.js';
import { handleCheckFreshness } from './tools/check-freshness.js';
import { handleSearchLandRules } from './tools/search-land-rules.js';
import { handleCheckHedgerowRules } from './tools/check-hedgerow-rules.js';
import { handleGetFellingLicenceRules } from './tools/get-felling-licence-rules.js';
import { handleCheckSSSIConsent } from './tools/check-sssi-consent.js';
import { handleGetRightsOfWayRules } from './tools/get-rights-of-way-rules.js';
import { handleGetCommonLandRules } from './tools/get-common-land-rules.js';
import { handleGetPlantingGuidance } from './tools/get-planting-guidance.js';
import { handleGetTPORules } from './tools/get-tpo-rules.js';

const SERVER_NAME = 'dk-land-woodland-mcp';
const SERVER_VERSION = '0.1.0';
const PORT = parseInt(process.env.PORT ?? '3000', 10);

const SearchArgsSchema = z.object({
  query: z.string(),
  topic: z.string().optional(),
  jurisdiction: z.string().optional(),
  limit: z.number().optional(),
});

const HedgerowArgsSchema = z.object({
  action: z.string(),
  hedgerow_type: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const FellingArgsSchema = z.object({
  volume_m3: z.number().optional(),
  area_ha: z.number().optional(),
  reason: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const SSSIArgsSchema = z.object({
  activity: z.string(),
  jurisdiction: z.string().optional(),
});

const RoWArgsSchema = z.object({
  path_type: z.string().optional(),
  issue: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const CommonLandArgsSchema = z.object({
  activity: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const PlantingArgsSchema = z.object({
  tree_type: z.string().optional(),
  purpose: z.string().optional(),
  area_ha: z.number().optional(),
  jurisdiction: z.string().optional(),
});

const TPOArgsSchema = z.object({
  scenario: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const TOOLS = [
  {
    name: 'about',
    description: 'Get server metadata: name, version, coverage, data sources, and links.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'list_sources',
    description: 'List all data sources with authority, URL, license, and freshness info.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'check_data_freshness',
    description: 'Check when data was last ingested, staleness status, and how to trigger a refresh.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'search_land_rules',
    description: 'Full-text search across all Danish land and woodland management rules. Use for broad queries about hegn, fredskov, §3-natur, adgangsret, overdrev, or skovrejsning.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Free-text search query (Danish or English)' },
        topic: { type: 'string', description: 'Filter by topic (hedgerow, felling, sssi, rights_of_way, common_land, planting)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: DK)' },
        limit: { type: 'number', description: 'Max results (default: 20, max: 50)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'check_hedgerow_rules',
    description: 'Check Danish hegn regulations by action type. Returns hegnspligt requirements, §3-beskyttelse, randzoner, skovbyggelinje, and hegnssyn rules under Hegnsloven and Naturbeskyttelsesloven.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        action: { type: 'string', description: 'Action type (e.g. fjernelse, klipning, hegning, randzone, hegnssyn)' },
        hedgerow_type: { type: 'string', description: 'Hegn type (e.g. levende hegn, §3-areal, strandbeskyttelseslinje)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: DK)' },
      },
      required: ['action'],
    },
  },
  {
    name: 'get_felling_licence_rules',
    description: 'Get Danish skovlov felling rules by scenario. Returns whether felling requires permission, exemptions, application process, and penalties under Skovloven.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        volume_m3: { type: 'number', description: 'Volume of timber to fell in cubic metres' },
        area_ha: { type: 'number', description: 'Area of woodland in hectares' },
        reason: { type: 'string', description: 'Reason for felling (e.g. nødstildet, rydning, skovrejsning, juletræer)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: DK)' },
      },
    },
  },
  {
    name: 'check_sssi_consent',
    description: 'Check whether an activity on a §3-beskyttet naturtype requires dispensation from the kommune. Returns process, typical conditions, and penalties under Naturbeskyttelsesloven §3.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        activity: { type: 'string', description: 'Proposed activity (e.g. dræning, dyrkning, gødskning, pesticider, anlæg, afbrænding, tilplantning)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: DK)' },
      },
      required: ['activity'],
    },
  },
  {
    name: 'get_rights_of_way_rules',
    description: 'Get Danish adgangsret (right of access) rules by type and issue. Returns access rights for private skove, strandbredder, overdrev, offentlige stier, ridning, and hunde båndpligt.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path_type: { type: 'string', description: 'Access type (skov, strand, overdrev, sti, ridning, hund)' },
        issue: { type: 'string', description: 'Issue type (e.g. adgang, hund, camping, cykling, ridning, spærring)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: DK)' },
      },
    },
  },
  {
    name: 'get_common_land_rules',
    description: 'Get Danish rules for overdrev and fællesarealer. Returns §3 protection rules, consent requirements, and responsible authority under Naturbeskyttelsesloven.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        activity: { type: 'string', description: 'Proposed activity (e.g. dyrkning, hegning, afgræsning, adgang, omlægning)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: DK)' },
      },
    },
  },
  {
    name: 'get_planting_guidance',
    description: 'Get Danish skovrejsning guidance including tilskud (grants), VVM-screening thresholds, and species recommendations under Skovloven and Skovtilskudsordningen.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        tree_type: { type: 'string', description: 'Species group (e.g. løvskov, nåleskov, blandet, brede/elle)' },
        purpose: { type: 'string', description: 'Planting purpose (e.g. skovrejsning, vandløb, agroforstbrug, naturlig tilgroning)' },
        area_ha: { type: 'number', description: 'Planned planting area in hectares (VVM-screening required if >20ha)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: DK)' },
      },
    },
  },
  {
    name: 'get_tpo_rules',
    description: 'Get Danish rules for fredede træer, skovbyggelinjen, and fortidsmindebeskyttelseslinjen. Returns dispensation requirements, exemptions, process, and penalties.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        scenario: { type: 'string', description: 'Scenario (e.g. fredet træ, skovbyggelinje, fortidsminde, jordarbejde)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: DK)' },
      },
    },
  },
];

function textResult(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
}

function errorResult(message: string) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }], isError: true };
}

function registerTools(server: Server, db: Database): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    try {
      switch (name) {
        case 'about':
          return textResult(handleAbout());
        case 'list_sources':
          return textResult(handleListSources(db));
        case 'check_data_freshness':
          return textResult(handleCheckFreshness(db));
        case 'search_land_rules':
          return textResult(handleSearchLandRules(db, SearchArgsSchema.parse(args)));
        case 'check_hedgerow_rules':
          return textResult(handleCheckHedgerowRules(db, HedgerowArgsSchema.parse(args)));
        case 'get_felling_licence_rules':
          return textResult(handleGetFellingLicenceRules(db, FellingArgsSchema.parse(args)));
        case 'check_sssi_consent':
          return textResult(handleCheckSSSIConsent(db, SSSIArgsSchema.parse(args)));
        case 'get_rights_of_way_rules':
          return textResult(handleGetRightsOfWayRules(db, RoWArgsSchema.parse(args)));
        case 'get_common_land_rules':
          return textResult(handleGetCommonLandRules(db, CommonLandArgsSchema.parse(args)));
        case 'get_planting_guidance':
          return textResult(handleGetPlantingGuidance(db, PlantingArgsSchema.parse(args)));
        case 'get_tpo_rules':
          return textResult(handleGetTPORules(db, TPOArgsSchema.parse(args)));
        default:
          return errorResult(`Unknown tool: ${name}`);
      }
    } catch (err) {
      return errorResult(err instanceof Error ? err.message : String(err));
    }
  });
}

const db = createDatabase();
const sessions = new Map<string, { transport: StreamableHTTPServerTransport; server: Server }>();

function createMcpServer(): Server {
  const mcpServer = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } }
  );
  registerTools(mcpServer, db);
  return mcpServer;
}

async function handleMCPRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;

  if (sessionId && sessions.has(sessionId)) {
    const session = sessions.get(sessionId)!;
    await session.transport.handleRequest(req, res);
    return;
  }

  if (req.method === 'GET' || req.method === 'DELETE') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid or missing session ID' }));
    return;
  }

  const mcpServer = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });

  await mcpServer.connect(transport);

  transport.onclose = () => {
    if (transport.sessionId) {
      sessions.delete(transport.sessionId);
    }
    mcpServer.close().catch(() => {});
  };

  await transport.handleRequest(req, res);

  if (transport.sessionId) {
    sessions.set(transport.sessionId, { transport, server: mcpServer });
  }
}

const httpServer = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  if (url.pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', server: SERVER_NAME, version: SERVER_VERSION }));
    return;
  }

  if (url.pathname === '/mcp' || url.pathname === '/') {
    try {
      await handleMCPRequest(req, res);
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }));
      }
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

httpServer.listen(PORT, () => {
  console.log(`${SERVER_NAME} v${SERVER_VERSION} listening on port ${PORT}`);
});
