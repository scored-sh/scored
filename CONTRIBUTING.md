# Contributing to scored.sh

## Submit a CLI

The easiest way to add a CLI to scored.sh:

1. [Open an issue](https://github.com/scored-sh/scored/issues/new?template=submit-cli.yml) with the CLI's GitHub repo URL
2. We audit the CLI on 30 tests
3. Score is computed, CLI goes live on the leaderboard

That's it. You don't need to write any YAML.

## Correct a Score

If you think a score is wrong:

1. Fork this repo
2. Edit the relevant `data/{slug}.yaml` file — change the boolean/enum values you disagree with
3. Open a PR with **evidence** (terminal output, docs link, or screenshot)
4. CI will compute the new score and show the diff

**Important:** Never edit scores directly. Scores are computed from the boolean/enum values by `scripts/score.ts`. Change the data, the score updates automatically.

## How Scoring Works

Each CLI is scored on 10 dimensions of AI agent readiness:

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

**Total: 100 points**

Grades: S (90+), A (75-89), B (60-74), C (45-59), D (30-44), F (0-29)

## YAML Schema

Each CLI is a YAML file in `data/` containing booleans and enums only. See `schema/cli.schema.json` for the full schema and `data/_template.yaml` for a complete example.

## Local Development

```bash
npm install
npm run dev
```

The scoring engine runs at build time:

```bash
npx tsx scripts/score.ts
```
