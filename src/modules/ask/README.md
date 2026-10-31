# Ask Module (`src/modules/ask`)

**OWNER**: Dev A (`@devA`)  
**Domain**: Natural Language Querying & Analytical Translation

## Responsibilities
- Natural-language query interface for internal executives.
- Translates unstructured prompts into **whitelisted filter JSON clauses**.
- Zero raw SQL execution: always queries via safe, indexed analytical aggregation routes.

## Public API (`index.ts`)
Only import from this module via `@/modules/ask`.
- `askService.processQuery(dto: AskQueryDTO): Promise<AskQueryResultDTO>`

## TODOs for Dev A
1. [ ] Integrate lightweight LLM intent parser (e.g. Gemini Flash) with deterministic schema enforcement.
2. [ ] Cache frequent analytical questions.
