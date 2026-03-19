# scored.sh

Every SaaS product CLI scored for AI agent readiness. One score. One grade.

## What is this?

A registry that scores SaaS product CLIs (Stripe, GitHub, Resend, Vercel, etc.) on 10 dimensions of how well they work with AI agents.

Each CLI gets a score out of 100 and a letter grade (S/A/B/C/D/F).

## Scoring Criteria

| Criterion | Max Points |
|-----------|-----------|
| JSON Output | 20 |
| Non-Interactive Mode | 15 |
| Auth Automation | 15 |
| Structured Errors | 10 |
| Agent Ecosystem | 10 |
| Schema Discovery | 10 |
| Exit Codes | 5 |
| Pagination | 5 |
| Field Selection | 5 |
| Safety Rails | 5 |

## Submit a CLI

[Open an issue](https://github.com/scored-sh/scored/issues/new?template=submit-cli.yml) with the GitHub repo URL. We audit the CLI and add it to the leaderboard.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## How It Works

- Each CLI is a YAML file in `data/` with booleans and enums
- Scores are computed at build time by `scripts/score.ts`
- Contributors submit data, never scores
- The website reads computed scores from `.generated/`

## Development

```bash
npm install
npm run dev
```

## Related

- [awesome-product-cli](https://github.com/progrmoiz/awesome-product-cli) — curated list of 55+ SaaS product CLIs

## License

MIT
