# Data Model

Game data remains separate from application behavior and presentation.

Palworld data is stored in:

```text
data/games/palworld/
```

The detailed Pal, region, base, and completion schemas will be finalized
before production records are imported.

## Rules

- Do not publish knowingly incomplete placeholder records as real data.
- Use stable identifiers for relationships.
- Store local asset paths.
- Record source and verification information.
- Keep every data file valid JSON.
