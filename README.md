# Danish Land & Woodland Management MCP

[![CI](https://github.com/Ansvar-Systems/dk-land-woodland-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Ansvar-Systems/dk-land-woodland-mcp/actions/workflows/ci.yml)
[![GHCR](https://github.com/Ansvar-Systems/dk-land-woodland-mcp/actions/workflows/ghcr-build.yml/badge.svg)](https://github.com/Ansvar-Systems/dk-land-woodland-mcp/actions/workflows/ghcr-build.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Danish land and woodland management regulations via the [Model Context Protocol](https://modelcontextprotocol.io). Query hegn (hedgerow) regulations, skovlov felling rules, §3 nature protection consent, adgangsret (rights of access), overdrev and fællesarealer rules, and skovrejsning (woodland planting) guidance — all from your AI assistant.

Part of [Ansvar Open Agriculture](https://ansvar.eu/open-agriculture).

## Why This Exists

Landowners, farmers, and land agents in Denmark need to check regulatory requirements before managing hedgerows, felling trees in fredskov, working on §3-protected nature areas, or planting woodland. These rules are spread across Skovloven, Naturbeskyttelsesloven, Hegnsloven, and agency guidance. This MCP server brings them together in a single queryable source.

## Quick Start

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "dk-land-woodland": {
      "command": "npx",
      "args": ["-y", "@ansvar/dk-land-woodland-mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add dk-land-woodland npx @ansvar/dk-land-woodland-mcp
```

### Streamable HTTP (remote)

```
https://mcp.ansvar.eu/dk-land-woodland/mcp
```

### Docker (self-hosted)

```bash
docker run -p 3000:3000 ghcr.io/ansvar-systems/dk-land-woodland-mcp:latest
```

### npm (stdio)

```bash
npx @ansvar/dk-land-woodland-mcp
```

## Example Queries

Ask your AI assistant:

- "Skal jeg have tilladelse til at fjerne et levende hegn?"
- "Kræver fældning i fredskov en tilladelse?"
- "Hvad kræver det at dræne et §3-beskyttet eng?"
- "Har offentligheden adgang til min private skov?"
- "Kan jeg bygge inden for skovbyggelinjen?"
- "Hvilke tilskud findes til skovrejsning med løvskov?"

## Stats

| Metric | Value |
|--------|-------|
| Tools | 11 (3 meta + 8 domain) |
| Jurisdiction | DK |
| Data sources | Skovloven, Naturbeskyttelsesloven, Hegnsloven, Miljøbeskyttelsesloven, Kystdirektoratet, Landbrugsstyrelsen |
| License (data) | Åbne Offentlige Data (retsinformation.dk) |
| License (code) | Apache-2.0 |
| Transport | stdio + Streamable HTTP |

## Tools

| Tool | Description |
|------|-------------|
| `about` | Server metadata and links |
| `list_sources` | Data sources with freshness info |
| `check_data_freshness` | Staleness status and refresh command |
| `search_land_rules` | FTS5 search across all Danish land/woodland rules |
| `check_hedgerow_rules` | Hegn regulations: fjernelse, hegnssyn, §3-beskyttelse, randzoner |
| `get_felling_licence_rules` | Skovlov felling rules: fredskov, rydning, genplantning, skovrejsning |
| `check_sssi_consent` | §3-naturtype dispensation: dræning, dyrkning, gødskning, anlæg |
| `get_rights_of_way_rules` | Adgangsret: skove, strandbredder, overdrev, stier, båndpligt |
| `get_common_land_rules` | Overdrev og fællesarealer: afgræsning, hegning, adgang |
| `get_planting_guidance` | Skovrejsningstilskud, VVM-screening, naturlig tilgroning |
| `get_tpo_rules` | Fredede træer, skovbyggelinje, fortidsmindebeskyttelse |

See [TOOLS.md](TOOLS.md) for full parameter documentation.

## Security Scanning

This repository runs security checks on every push:

- **CodeQL** — static analysis for JavaScript/TypeScript
- **Gitleaks** — secret detection across full history
- **Dependency review** — via Dependabot
- **Container scanning** — via GHCR build pipeline

See [SECURITY.md](SECURITY.md) for reporting policy.

## Disclaimer

This tool provides reference data for informational purposes only. It is not professional legal or land management advice. Requirements vary by kommune and site-specific designations. See [DISCLAIMER.md](DISCLAIMER.md).

## Contributing

Issues and pull requests welcome. For security vulnerabilities, email security@ansvar.eu (do not open a public issue).

## License

Apache-2.0. Data sourced under Åbne Offentlige Data (retsinformation.dk).
